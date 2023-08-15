<?php
namespace HappyVR;

class Frontend {
    public function __construct() {
        add_shortcode(HAPPYVR_SHORTCODE_NAME, [$this, 'shortcode']);
    }
    private function get_globals() {
        $globals = [
            'version' => HAPPYVR_PLUGIN_VERSION
        ];
        return $globals;
    }
    private function init_loader() {
        wp_enqueue_style('happyvr-pannellum', HAPPYVR_PLUGIN_URL . 'assets/pannellum/css/pannellum.css', [], HAPPYVR_PLUGIN_VERSION);
        wp_enqueue_script('happyvr-libpannellum', HAPPYVR_PLUGIN_URL . 'assets/pannellum/js/libpannellum.js', [], HAPPYVR_PLUGIN_VERSION, false);
        wp_enqueue_script('happyvr-pannellum', HAPPYVR_PLUGIN_URL . 'assets/pannellum/js/pannellum.js', [], HAPPYVR_PLUGIN_VERSION, false);

        wp_enqueue_style('happyvr-main', HAPPYVR_PLUGIN_URL . 'assets/css/main.css', [], HAPPYVR_PLUGIN_VERSION);
        wp_enqueue_script('happyvr-loader', HAPPYVR_PLUGIN_URL . 'assets/js/loader.js', ['jquery'], HAPPYVR_PLUGIN_VERSION, true);
        wp_localize_script('happyvr-loader', 'happyvr_globals', $this->get_globals());
    }
    public function shortcode($atts = []) {
        $atts = array_change_key_case($atts, CASE_LOWER);
        $defaults = [
            'image'  => null,
            'title'  => null,
            'class'  => null,
            'width'  => null,
            'height' => null
        ];
        $atts = shortcode_atts($defaults, $atts);

        if(empty($atts['image'])) {
            return;
        }

        $this->init_loader();

        $inlineStyles = '';
        $inlineStyles .= (!empty($atts['width']) ? 'width:' . $atts['width'] . ';' : '');
        $inlineStyles .= (!empty($atts['height']) ? 'height:' . $atts['height'] . ';' : '');

        $data = '';
        $data .= '<div class="happyvr-panorama';
        $data .= (!empty($atts['class']) ? ' ' . esc_attr($atts['class']) : '') . '" ';
        $data .= 'data-image="' . esc_attr($atts['image']) . '" ';
        $data .= (!empty($atts['title']) ? 'data-title="' . esc_attr($atts['title']) . '" ' : '');
        $data .= (!empty($inlineStyles) ? 'style="' . esc_attr($inlineStyles) . '"' : '');
        $data .= '>';
        $data .= '</div>';

        return $data;
    }
}