// Bump this whenever any precached asset changes, otherwise clients keep
// serving the old copy forever.
const CACHE_NAME = 'timekeeper-v1';

// All URLs are relative so the worker keeps working under a project page
// subpath such as /timekeeper/.
// theme/*.css is injected at runtime by js/timekeeper.js, so it cannot be
// found by looking at index.html alone. All three must be listed here.
const PRECACHE_URLS = [
	'./',
	'./index.html',
	'./manifest.webmanifest',
	'./favicon.svg',
	'./icon/favicon-180.png',
	'./icon/favicon-192.png',
	'./icon/favicon-512.png',
	'./css/timekeeper.css',
	'./theme/default.css',
	'./theme/example.css',
	'./theme/traffic.css',
	'./font/Roboto-fancyColon-Medium.woff',
	'./bootstrap/css/bootstrap.min.css',
	'./bootstrap/js/bootstrap.min.js',
	'./bootstrap/fonts/glyphicons-halflings-regular.woff2',
	'./bootstrap/fonts/glyphicons-halflings-regular.woff',
	'./js/jquery-1.11.3.min.js',
	'./js/jquery.timer.js',
	'./js/purify.min.js',
	'./js/timekeeper.js',
	'./wav/chime1.mp3',
	'./wav/chime2.mp3',
	'./wav/chime3.mp3'
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				return cache.addAll(PRECACHE_URLS);
			})
			.then(function () {
				return self.skipWaiting();
			})
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys()
			.then(function (names) {
				return Promise.all(names.map(function (name) {
					return name === CACHE_NAME ? null : caches.delete(name);
				}));
			})
			.then(function () {
				return self.clients.claim();
			})
	);
});

// Safari (iOS in particular) requests audio with a Range header. Cache.match()
// ignores Range and hands back the full 200 response, which the media element
// then refuses to play. Slice the cached body ourselves and answer with a
// proper 206 instead.
function buildRangeResponse(response, rangeHeader) {
	return response.arrayBuffer().then(function (buffer) {
		const size = buffer.byteLength;
		const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
		if (!match) {
			return new Response(null, { status: 416, statusText: 'Range Not Satisfiable' });
		}

		let start, end;
		if (match[1] === '') {
			// Suffix form: "bytes=-500" means the last 500 bytes.
			if (match[2] === '') {
				return new Response(null, { status: 416, statusText: 'Range Not Satisfiable' });
			}
			start = Math.max(0, size - parseInt(match[2], 10));
			end = size - 1;
		} else {
			start = parseInt(match[1], 10);
			end = match[2] === '' ? size - 1 : Math.min(parseInt(match[2], 10), size - 1);
		}

		if (start > end || start >= size) {
			return new Response(null, { status: 416, statusText: 'Range Not Satisfiable' });
		}

		const headers = new Headers(response.headers);
		headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
		headers.set('Content-Length', String(end - start + 1));
		headers.set('Accept-Ranges', 'bytes');

		return new Response(buffer.slice(start, end + 1), {
			status: 206,
			statusText: 'Partial Content',
			headers: headers
		});
	});
}

self.addEventListener('fetch', function (event) {
	const request = event.request;

	if (request.method !== 'GET') {
		return;
	}
	if (new URL(request.url).origin !== self.location.origin) {
		return;
	}

	const range = request.headers.get('range');

	event.respondWith(
		caches.match(request, { ignoreSearch: true, ignoreVary: true })
			.then(function (cached) {
				if (cached) {
					return range ? buildRangeResponse(cached.clone(), range) : cached;
				}

				return fetch(request)
					.then(function (response) {
						// Opaque and error responses are not worth caching.
						if (response && response.ok && response.type === 'basic' && !range) {
							const copy = response.clone();
							caches.open(CACHE_NAME).then(function (cache) {
								cache.put(request, copy);
							});
						}
						return response;
					})
					.catch(function (error) {
						// Offline and nothing cached: fall back to the shell for
						// navigations so a bookmarked URL with a hash still opens.
						if (request.mode === 'navigate') {
							return caches.match('./index.html');
						}
						throw error;
					});
			})
	);
});
