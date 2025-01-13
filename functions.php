<?php
// Register Custom Post Type
function register_daily_horoscope_post_type() {
    $labels = array(
        'name'                  => 'ดวงรายวัน',
        'singular_name'         => 'ดวงรายวัน',
        'menu_name'            => 'ดวงรายวัน',
        'add_new'              => 'เพิ่มดวงใหม่',
        'add_new_item'         => 'เพิ่มดวงรายวันใหม่',
        'edit_item'            => 'แก้ไขดวงรายวัน',
        'new_item'             => 'รายการใหม่',
        'view_item'            => 'ดูดวงรายวัน',
        'search_items'         => 'ค้นหาดวงรายวัน',
        'not_found'            => 'ไม่พบข้อมูล',
        'not_found_in_trash'   => 'ไม่พบข้อมูลในถังขยะ'
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'query_var'           => true,
        'rewrite'             => array('slug' => 'daily-horoscope'),
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-star-filled',
        'supports'            => array('title', 'editor'),
        'show_in_rest'        => true
    );

    register_post_type('daily_horoscope', $args);
}
add_action('init', 'register_daily_horoscope_post_type');

// Add CORS Support
function add_cors_headers() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
add_action('init', 'add_cors_headers');