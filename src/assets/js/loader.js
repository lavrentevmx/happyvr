;(function($, window, document, undefined) {
    'use strict';

    $(() => {
        $('.happyvr-panorama').each((index, el) => {
            const $panorama = $(el);
            const image = $panorama.attr('data-image');
            const title = $panorama.attr('data-title');

            const config = {
                panorama: image,
                autoLoad: true,
                showControls: false
            }

            if(title) config.title = title;

            pannellum.viewer($panorama.get(0), config);
        });
    });
})(jQuery, window, document);