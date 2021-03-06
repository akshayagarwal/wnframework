wn.provide('erpnext.desktop');

erpnext.desktop.refresh = function() {
	erpnext.desktop.render();

	$("#icon-grid").sortable({
		update: function() {
			new_order = [];
			$("#icon-grid .case-wrapper").each(function(i, e) {
				new_order.push($(this).attr("data-name"));
			});
			wn.defaults.set_default("_desktop_items", new_order);
		}
	});
}

erpnext.desktop.render = function() {
	document.title = "Desktop";
	var add_icon = function(m) {
		var module = wn.modules[m];
		if(!module.label) 
			module.label = m;
		module.name = m;
		module.label = wn._(module.label);
		//module.gradient_css = wn.get_gradient_css(module.color, 45);
		module._link = module.link.toLowerCase().replace("/", "-");
		
		$module_icon = $(repl('<div id="module-icon-%(_link)s" class="case-wrapper" \
				data-name="%(name)s" data-link="%(link)s">\
				<div id="module-count-%(_link)s" class="circle" style="display: None">\
					<span class="circle-text"></span>\
				 </div>\
				<div class="case-border" style="background-color: %(color)s">\
					<i class="%(icon)s"></i>\
				</div>\
				<div class="case-label">%(label)s</div>\
			</div>', module)).click(function() {
				wn.set_route($(this).attr("data-link"));
			}).css({
				cursor:"pointer"
			}).appendTo("#icon-grid");
	}
	
	// modules
	var modules_list = wn.user.get_desktop_items();
	$.each(modules_list, function(i, m) {
		if(m!="Setup")
			add_icon(m);
	})

	// setup
	if(user_roles.indexOf('System Manager')!=-1)
		add_icon('Setup')

	// notifications
	erpnext.desktop.show_pending_notifications();
	
	$(document).on("notification-update", function() {
		erpnext.desktop.show_pending_notifications();
	})

}

erpnext.desktop.show_pending_notifications = function() {
	var modules_list = wn.user.get_desktop_items();
	$.each(modules_list, function(i, module) {
		var module_doctypes = wn.boot.notification_info.module_doctypes[module];
		var sum = 0;
		if(module_doctypes) {
			$.each(module_doctypes, function(j, doctype) {
				sum += (wn.boot.notification_info.open_count_doctype[doctype] || 0);
			});
		} else if(wn.boot.notification_info.open_count_module[module]!=null) {
			sum = wn.boot.notification_info.open_count_module[module];
		}
		var notifier = $("#module-count-" + wn.modules[module]._link);
		if(notifier.length) {
			notifier.toggle(sum ? true : false);
			notifier.find(".circle-text").html(sum || "");
		}
	});
}

pscript.onload_desktop = function(wrapper) {
	// load desktop
	erpnext.desktop.refresh();
	$(wrapper).css({"background-color": "transparent", "box-shadow":"none"});
	
}

