/**
 * @name CKEditor edit in place 
 * @version 2.1 (7 July 2014)
 * @author Earthchie (http://www.earthchie.com/)
 * @require JQuery 1.8 or newer
 *
 * @license WTFPL v.2 - http://www.wtfpl.net/
 */

$(function(){
	$('head').append('<style>.ckeip-container .ckeip-hover{display:none}.ckeip-container:hover .ckeip-hover{display:block}</style>');
	
	/* presets */
	
	// simple toolbar
	$('.simple-toolbar.editable').editable({
		cke_options: {
			toolbar:[
				['Bold','Italic','Underline'],
				['Maximize']
			],
		}
	});
	
	// normal toolbar
	$('.normal-toolbar.editable').editable({
		cke_options: {
			toolbar: [
				['Bold','Italic','Underline','Strike','Subscript','Superscript'],
				['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
				['NumberedList','BulletedList'],
				['TextColor','BGColor' ],
				['RemoveFormat' ],
				[ 'Format','Font','FontSize' ],
				['Outdent','Indent'],
				[ 'Link','Unlink','-','ShowBlocks'],'/',
				['NewPage'],
				['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar' ],
				['Cut','Copy','Paste','PasteText','PasteFromWord'],
				['Undo','Redo','-','Source','-','Maximize']
			],
		}
	});
	
	// no toolbar, no new line
	$('.no-toolbar.editable').editable({
		cke_options: {
			removePlugins: 'toolbar,elementspath',
			resize_enabled: false,
			contentsCss: 'body{font-family:helvetical,arial,sans-serif;overflow:hidden;padding:0;margin:4px;}',
			height: 50,
		}
	});
	
	// default
	$('.editable,[contenteditable=true]').editable();
});

var _ckeip = {};
var _ckeip_bkup = {};
var _ckeip_options = {};

var _ckeip_fn_prepare_hover = function(id){
	return '<div class="ckeip-hover" style="'+
				'position: absolute;'+
				'background: '+_ckeip_options[id].hover_background+';'+
				'color: '+_ckeip_options[id].hover_color+';'+
				'padding: '+_ckeip_options[id].hover_padding+';'+
				'font-size: '+_ckeip_options[id].hover_font_size+';'+
				'line-height: '+_ckeip_options[id].hover_line_height+';'+
				'top: '+_ckeip_options[id].hover_top+';'+
				'left: '+_ckeip_options[id].hover_left+';'+
			'">'+_ckeip_options[id].hover_text+'</div>';
}

$.fn.editable = function(options){
	
	$(this).each(function(){

		if(!$(this).parent().hasClass('ckeip-container')){ // if not instanced
			
			// assign container id
			var id = 'ckeip-'+(Math.random()+1).toString().replace('.','').substring(0,5); // random 5 digit number
			$(this).wrap('<div id="'+id+'" class="ckeip-container" style="position:relative;"></div>'); // wrap target with container
			
			// prepare options
			_ckeip_options[id] = $.extend({
				
				ajax_var_name: 'content',
				ajax_url: false,
				ajax_success: function(response){},
				ajax_error: function(response){},
				
				callback_save: function(){},
				callback_cancel: function(){},
				
				placeholder_text: 'Double click to edit',
				placeholder_color: 'grey',
				
				button_save_label: 'Save',
				button_loading_label: 'Please Wait',
				button_save_class: '',
				button_cancel_label: 'Cancel',
				button_cancel_class: '',
				
				hover_text: 'Double click to edit',
				hover_background: 'rgba(0,0,0,.9)',
				hover_color: '#fff',
				hover_top: '-2.5em',
				hover_left: '0',
				hover_padding: '0.5em',
				hover_font_size: '0.7em',
				hover_line_height: '1em',
				
				cke_options: {
					height: $(this).outerHeight()+100,
				},
				
			},options);

			$(this).addClass('ckeip');
			
			if($(this).attr('contenteditable') == 'true'){ // prevent CKEditor from using inline editor
				$(this).attr('data-contenteditable','true');
				$(this).removeAttr('contenteditable');
			}
			
			// placeholder
			if($(this).html() == ""){
				$(this).html('<span class="ckeip-placeholder" style="color:'+_ckeip_options[id].placeholder_color+';font-style:italic;">'+_ckeip_options[id].placeholder_text+'</span>');
			}
			
			// add hover effect
			$(this).parent().append(_ckeip_fn_prepare_hover(id));
			
			// double click event - instance CKEditor
			$(this).parent().dblclick(function(){
				var id = $(this).attr('id');
				var $editable = $(this).find('.ckeip');
				$editable.find('.ckeip-placeholder').remove();
				
				_ckeip_bkup[id] = $editable.html();
				_ckeip[id] = CKEDITOR.replace($editable.get(0),_ckeip_options[id].cke_options);
				
				var buttons =   '<div style="text-align:right;">'+
									'<button class="ckeip-save">'+_ckeip_options[id].button_save_label+'</button>&nbsp;'+
									'<button class="ckeip-cancel">'+_ckeip_options[id].button_cancel_label+'</button>'+
								'</div>';
				$(this).append(buttons);
				
				// assign custom class
				$(this).find('.ckeip-save').addClass(_ckeip_options[id].button_save_class);
				$(this).find('.ckeip-cancel').addClass(_ckeip_options[id].button_cancel_class);
				
				$(this).find('.ckeip-hover').remove();
				
				// save event
				$(this).find('.ckeip-save').click(function(){
					
					var $this = $(this);
					var $parent = $(this).parent().parent();
					var id = $parent.attr('id');
					var $editable = $parent.find('.ckeip');
					
					// get and override ajax_url from attribute data-handler (if exist)
					if($editable.data('handler')){
						_ckeip_options[id].ajax_url = $editable.data('handler');
					}
					
					if(_ckeip_options[id].ajax_url){ // do ajax
					
						var data = {};
						data[_ckeip_options[id].ajax_var_name] = _ckeip[id].getData();
						
						$(this).text(_ckeip_options[id].button_loading_label);
						$(this).attr('disabled','');
						
						$.ajax({
							type: 'POST',
							url: _ckeip_options[id].ajax_url,
							data: data
						}).done(function(response){
							if(typeof _ckeip_options[id].ajax_success == 'function'){
								_ckeip_options[id].ajax_success(response);
							}
							
							_ckeip[id].destroy();
						
							if($editable.html() == ""){
								$editable.html('<span class="ckeip-placeholder" style="color:'+_ckeip_options[id].placeholder_color+';font-style:italic;">'+_ckeip_options[id].placeholder_text+'</span>');
							}
							
							$this.parent().remove();
							
							// add hover effect
							$parent.append(_ckeip_fn_prepare_hover(id));
						
						})
						.fail(function(response){
							if(typeof _ckeip_options[id].ajax_error == 'function'){
								_ckeip_options[id].ajax_error(response);
							}
						})
						.always(function(response){
							$this.text(_ckeip_options[id].button_save_label);
							$this.removeAttr('disabled');
							
							if(typeof _ckeip_options[id].callback_save == 'function'){
								_ckeip_options[id].callback_save(response);
							}
						});
						
					}else{ // offline mode
					
						_ckeip[id].destroy();
						
						if($editable.html() == ""){
							$editable.html('<span class="ckeip-placeholder" style="color:'+_ckeip_options[id].placeholder_color+';font-style:italic;">'+_ckeip_options[id].placeholder_text+'</span>');
						}
						$(this).parent().remove();
						
						// add hover effect
						$parent.append(_ckeip_fn_prepare_hover(id));
						
						if(typeof _ckeip_options[id].callback_save == 'function'){
							_ckeip_options[id].callback_save();
						}
					}
					
				});
				
				// cancel event
				$(this).find('.ckeip-cancel').click(function(){
					
					var $parent = $(this).parent().parent();
					var id = $parent.attr('id');
					var $editable = $parent.find('.ckeip');
					
					_ckeip[id].destroy();
					
					$editable.html(_ckeip_bkup[id]);
					
					if($editable.html() == ""){
						$editable.html('<span class="ckeip-placeholder" style="color:'+_ckeip_options[id].placeholder_color+';font-style:italic;">'+_ckeip_options[id].placeholder_text+'</span>');
					}
					
					$(this).parent().remove();
					
					// add hover effect
					$parent.append(_ckeip_fn_prepare_hover(id));
					
					if(typeof _ckeip_options[id].callback_cancel == 'function'){
						_ckeip_options[id].callback_cancel();
					}
				});
			});
		}
	});
}

$.fn.not_editable = function (options){
	
	$(this).each(function(){
		if($(this).parent().hasClass('ckeip-container')){
		
			if($(this).attr('data-contenteditable') == 'true'){
				$(this).attr('contenteditable','true');
				$(this).removeAttr('data-contenteditable');
			}
			
			var id =  $(this).parent().attr('id');
			$(this).parent().find('.ckeip-cancel').trigger('click');
			$(this).removeClass('ckeip');
			$(this).find('.ckeip-placeholder').remove();
			$(this).parent().before($(this).get(0).outerHTML);
			$(this).parent().remove();
		}
	});
	
}