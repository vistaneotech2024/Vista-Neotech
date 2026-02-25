// JavaScript Document
(function () {
    tinymce.create('tinymce.plugins.tcsnshortcodes', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init: function (ed, url) {
			// General
			ed.addButton('tcsngeneral', {
				type: 'listbox',
				text: 'General',
				fixedWidth: true,
				icon: false,
				onselect: function(e) {
            		ed.insertContent(this.value());
        		},
		    values: [
				{text: 'Icon - Please refer help doc', value: '[tc_icon icon_name="star" color="" size=""]'},
				{text: 'Vertical spacer / gap', value: '[tc_spacer height="20px"]'},
				{text: 'Horizontal spacer / gap', value: '[tc_spacer_wide width="20px"]'},
				{text: 'Text Align', value: '[tc_align align="left/right/center"]Content Here[/tc_align]'},
				{text: 'Tooltip', value: '[tc_tooltip url="" title="Content inside tooltip" placement="top/bottom/left/right"]Link text[/tc_tooltip]'},
				{text: 'List - Pricing', value: '[tc_list_pricing][tc_list_item]List item one[/tc_list_item][tc_list_item]List item two[/tc_list_item][tc_list_item]List item three[/tc_list_item][/tc_list_pricing]'},
    		],
			});
			
			// Typography
			ed.addButton('tcsntypo', {
				type: 'listbox',
				text: 'Typography',
				fixedWidth: true,
				icon: false,
				onselect: function(e) {
            		ed.insertContent(this.value());
        		},
		    values: [
				{text: 'Text Style', value: '[tc_text_style size="" line_height="" color="" font_weight="" letter_spacing="" align="left/center/right"]Content here[/tc_text_style]'},
				{text: 'Highlight', value: '[tc_highlight bgcolor="" color="" font_size="" font_weight="" line_height=""]Content here[/tc_highlight]'},
				{text: 'Superscript Highlight', value: '[tc_sup_highlight bgcolor="" color=""]NEW[/tc_sup_highlight] '},
				{text: 'Dropcap Default', value: '[tc_dropcap style="dropcap-default" color="" ]T[/tc_dropcap]'},
				{text: 'Dropcap Styled', value: '[tc_dropcap style="dropcap-circle/dropcap-square" bg_color="" color="" border_color=""]T[/tc_dropcap]'},
    		],
			});
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo: function () {
            return {
                longname: 'Celebrate Core',
                author: 'Tansh',
                authorurl: 'http://tanshcreative.com',
                infourl: 'http://tanshcreative.com',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('tcsnshortcodes', tinymce.plugins.tcsnshortcodes);
})();