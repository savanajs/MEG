/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["https://savanajs.github.io/MEG/account-address.html","973f49e5ba26435f60384858763392cf"],["https://savanajs.github.io/MEG/account-change-password.html","32cc96eed4e7b2e4d8bae34658aeedb1"],["https://savanajs.github.io/MEG/account-edit.html","eb4012dc14f9f0c9e7a90c08032ea0d0"],["https://savanajs.github.io/MEG/account-orders.html","149a5b87bdb3c95a83afa51af88f4eee"],["https://savanajs.github.io/MEG/account.html","a357379adf3aaa2f3a3a57a4377e91d7"],["https://savanajs.github.io/MEG/cart.html","edb9b0ac5aff3058278f1fb6daf1f548"],["https://savanajs.github.io/MEG/catalog.html","7d4fc03100f5aa3b45660a48abf7d64f"],["https://savanajs.github.io/MEG/checkout-before-orderplaced.html","6f21837d43d615f3ce1e1e6d460881a2"],["https://savanajs.github.io/MEG/checkout-orderplaced.html","09b6a865176dade9c9d775c071938c11"],["https://savanajs.github.io/MEG/checkout.html","f04c7ce04624eba4c04c9ec6557e8e21"],["https://savanajs.github.io/MEG/cms.html","fbeaaa0ac1fb9627a4e224c5bbe522d8"],["https://savanajs.github.io/MEG/cms2.html","fbeaaa0ac1fb9627a4e224c5bbe522d8"],["https://savanajs.github.io/MEG/favicon.ico","ca6a7049224679b935e360d8d312719e"],["https://savanajs.github.io/MEG/home.html","9e1204735d6234b87421686ef1bc0375"],["https://savanajs.github.io/MEG/img/checked-disabled.png","5cca50f223b764002acbdb3149be21ae"],["https://savanajs.github.io/MEG/img/checked.png","75041e12bd04a208b967345bf8a0bc8c"],["https://savanajs.github.io/MEG/img/error.png","5219b7e8f2ba38786dc7c25274b48ea4"],["https://savanajs.github.io/MEG/img/icons/icon_1024x1024.a6ae814f3bb264ac4430241632c4c10c.png","a6ae814f3bb264ac4430241632c4c10c"],["https://savanajs.github.io/MEG/img/icons/icon_128x128.f5c7b3c53f617e4c6e2e64707bc15387.png","f5c7b3c53f617e4c6e2e64707bc15387"],["https://savanajs.github.io/MEG/img/icons/icon_192x192.84201ac1a96c999f9caa5f094b580102.png","84201ac1a96c999f9caa5f094b580102"],["https://savanajs.github.io/MEG/img/icons/icon_256x256.d16d5a94d683e858605b7b164c173139.png","d16d5a94d683e858605b7b164c173139"],["https://savanajs.github.io/MEG/img/icons/icon_384x384.5b1f5f89ab1ecbc19bc22e598debc645.png","5b1f5f89ab1ecbc19bc22e598debc645"],["https://savanajs.github.io/MEG/img/icons/icon_512x512.a2f1ab8b87acd2a2483d4c74a56b4726.png","a2f1ab8b87acd2a2483d4c74a56b4726"],["https://savanajs.github.io/MEG/img/icons/icon_96x96.dd71c32f991e98ff5f31ea45219fd453.png","dd71c32f991e98ff5f31ea45219fd453"],["https://savanajs.github.io/MEG/img/logo-mobile.svg","221c21dc67c0393b72092893e2e729d0"],["https://savanajs.github.io/MEG/img/logo.svg","febc2c68af10eed160caa491e2b0ae50"],["https://savanajs.github.io/MEG/img/meg-before-loading.gif","cad6f4f812d1291fed0cea96b6690d0c"],["https://savanajs.github.io/MEG/img/meg-loading-bar.gif","5592c3aea01023f60fc5986c7ada9fb5"],["https://savanajs.github.io/MEG/img/payment-flags.gif","ab7ca88a10365a8e53d61266729203f2"],["https://savanajs.github.io/MEG/index.html","308168ebb9a6f2f9e5b8268a4d0f37bb"],["https://savanajs.github.io/MEG/login.html","44bb45125bd6bd1e3dfef3efd6df7edf"],["https://savanajs.github.io/MEG/manifest.8acd2df31972bf158397be0517aee70e.json","8acd2df31972bf158397be0517aee70e"],["https://savanajs.github.io/MEG/meg.app.min.js","3d06f596af27c294b182b2bd6bf7689a"],["https://savanajs.github.io/MEG/meg.main.min.js","5cc01668acd11460b413f491036c4c27"],["https://savanajs.github.io/MEG/meg.min.css","8b087b2a536071b363ae22e84e0dc48f"],["https://savanajs.github.io/MEG/page-error.html","e24d63c092b80350c7377de9287ee0eb"],["https://savanajs.github.io/MEG/product.html","1b4e1e991e548ee5a18ecb947fb77ef1"],["https://savanajs.github.io/MEG/register.html","51a3afa2d5c7bad612fcbc24e0839e33"],["https://savanajs.github.io/MEG/store.html","9406d77c8690daea37140bf111161796"],["https://savanajs.github.io/MEG/vendors.js","12a86bbbe653e1e6ec973c563c5aba5a"]];
var cacheName = 'sw-precache-v3-meg--cache-id-1537712919297-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, /\.\w{8}\./);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = 'https://savanajs.github.io/MEG/index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







