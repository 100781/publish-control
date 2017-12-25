<?php
/*
Plugin Name: Publish Control
Plugin URI: https://publishcontrol.foundry81.com
Description: Provides a confirmation dialog upon content publishing.
Version: 1.0
Author: Matthew F. Fox
Author URI: https://100781.org
License: GPL2
*/

/**
 * Inject Publish Control Javascript in selected page.
 */
function publish_control(){
	$screen = get_current_screen();
	$postTypesSet = get_option('pubcontrol_posttypes');
	if (($screen->action == "add") && (in_array($screen->id, explode(",", $postTypesSet)) || $postTypesSet == "")) {
	$pubControlMessage = get_option( 'pubcontrol_message', 'Are you sure you want to publish this piece of content?' );
	$output            = <<<OUTPUT
<script>
var publishControl = true;
$("form#post").submit(function(e){
	var pubButton = $('#publish');
	if ($(this).find("input[type=submit]:focus").val() == "Publish"){
		if (publishControl === true) e.preventDefault();
		$.f81msgBox({
			success: function (result) {
				if (result === "Publish"){
					publishControl = false;
					pubButton.trigger("click");
				}
				if (result === "Cancel") {
				    history.replaceState(null, '', 'post-new.php');
				}
			},
			title: "<i class='icono-exclamationCircle'></i> Publish Control",
			message: "{$pubControlMessage}",
			buttons: [{ value: "Cancel", classname: "cancel", prefix: "<i class='icono-cross'></i>"}, { value: "Publish", classname: "ok", prefix: "<i class='icono-check'></i>"}],
			modal: true
		});
	}
});
</script>
OUTPUT;
	echo $output;
}
}

/**
 * Register/enqueue Javascript.
 */
function publish_control_admin_scripts() {
	wp_register_script('f81-msgbox', plugin_dir_url( __FILE__ ) . 'scripts/lib/jquery.f81.msgbox.min.js', array('jquery'), '1.0.0', true);
	wp_enqueue_script('f81-msgbox');
}

/**
 * Register/enqueue CSS.
 */
function publish_control_admin_styles() {
	wp_register_style( 'publish-control-styles',  plugin_dir_url( __FILE__ ) . 'style/publish-control.min.css' );
	wp_enqueue_style( 'publish-control-styles' );
	wp_register_style( 'icono',  plugin_dir_url( __FILE__ ) . 'style/lib/icono.min.css' );
	wp_enqueue_style( 'icono' );
}

/**
 * Add Post Control submenu to Settings menu.
 */
function publish_control_admin_menu() {
	add_submenu_page( 'options-general.php', 'Publish Control', 'Publish Control',
		'manage_options', 'publish-control', 'publish_control_settings');
}

/**
 * Save updated settings to wp_options table, display settings page.
 */
function publish_control_settings() {
	if (isset($_POST['action'])){
		if (isset($_POST['pubcontrol-message'])) {
			update_option('pubcontrol_message', $_POST['pubcontrol-message']);
		}
		if (isset($_POST['pubcontrol-posttypes'])) {
			update_option('pubcontrol_posttypes', implode(",", $_POST['pubcontrol-posttypes']));
		} else {
			update_option('pubcontrol_posttypes', '');
		}
	}
	include "publish-control-settings.php";
}

/**
 * Add settings link to plugin listing page.
 * @param $links
 *
 * @return mixed
 */
function publish_control_settings_link($links) {
	$settings_link = '<a href="options-general.php?page=publish-control">' . __( 'Settings' ) . '</a>';
	array_push( $links, $settings_link );
	return $links;
}

/**
 * Filters and actions.
 */
add_filter( "plugin_action_links_" . plugin_basename( __FILE__ ), 'publish_control_settings_link' );
add_action('admin_footer', 'publish_control');
add_action('admin_enqueue_scripts', 'publish_control_admin_styles');
add_action('admin_enqueue_scripts', 'publish_control_admin_scripts');
add_action('admin_menu', 'publish_control_admin_menu');
