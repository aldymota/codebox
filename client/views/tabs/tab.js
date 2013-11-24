define([
    "underscore",
    "jQuery",
    "hr/hr",
    "utils/dragdrop",
    "utils/keyboard",
    "utils/contextmenu"
], function(_, $, hr, DragDrop, Keyboard, ContextMenu) {
    // Tab header
    var TabView = hr.View.extend({
        className: "component-tab",
        defaults: {
            title: "",
            tabid: "",
            close: true
        },
        events: {
            "click":        "open",
            "click .close": "close",
            "dblclick":     "split",
            "dragstart":    "dragStart"
        },
        states: {
            'warning': "fa-exclamation",
            'offline': "fa-flash"
        },

        // Constructor
        initialize: function() {
            TabView.__super__.initialize.apply(this, arguments);

            var that = this;

            this.$el.attr("draggable", true);
            this.tabid = this.options.tabid;
            this.tabs = this.parent;
            this.section = this.options.section || 0;

            // Context menu
            ContextMenu.add(this.$el, [
                {
                    'type': "action",
                    'text': "New Tab",
                    'action': function() {
                        that.tabs.openDefaultNew();
                    }
                },
                { 'type': "divider" },
                {
                    'type': "action",
                    'text': "Close",
                    'action': function() {
                        that.close();
                    }
                },
                {
                    'type': "action",
                    'text': "Close Other Tabs",
                    'action': function() {
                        that.closeOthers();
                    }
                },
                { 'type': "divider" },
                {
                    'type': "action",
                    'text': "New Group",
                    'action': function() {
                        that.split();
                    }
                },
                { 'type': "divider" },
                {
                    'type': "action",
                    'text': "Auto Grid",
                    'action': function() {
                        that.tabs.setLayout();
                    }
                },
                {
                    'type': "action",
                    'text': "Columns: 2",
                    'action': function() {
                        that.tabs.setLayout(2);
                    }
                },
                {
                    'type': "action",
                    'text': "Columns: 3",
                    'action': function() {
                        that.tabs.setLayout(3);
                    }
                },
                {
                    'type': "action",
                    'text': "Columns: 4",
                    'action': function() {
                        that.tabs.setLayout(4);
                    }
                }
            ]);

            return this;
        },

        // Render the tab
        render: function() {
            this.$el.empty();

            var tab = this.tabs.tabs[this.tabid];

            var inner = $("<div>", {
                "class": "inner",
                "html": tab.title
            }).appendTo(this.$el);

            if (tab.state && this.states[tab.state]) {
                $("<i>", {
                    "class": "state fa "+this.states[tab.state]
                }).prependTo(inner);
            }

            if (this.options.close) {
                $("<a>", {
                    "class": "close",
                    "href": "#",
                    "html": "&times;"
                }).prependTo(inner);
            }
            return this.ready();
        },

        // Return true if is active
        isActive: function() {
            return this.$el.hasClass("active");
        },

        // Set section
        setSection: function(section) {
            this.section = section;
            this.open();
            this.tabs.update();
        },

        // Create section
        split: function(e) {
            if (e) e.stopPropagation();
            this.setSection(_.uniqueId("section"));
        },

        // (event) open
        open: function(e) {
            if (e != null) e.preventDefault();
            this.tabs.open(this.tabid);
        },

        // (event) Drag start
        dragStart: function(e) {
            DragDrop.drag(e, "move");
            DragDrop.setData(e, "tab", this.tabid);
        },

        // (event) close
        close: function(e, force) {
            if (e != null) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.tabs.close(this.tabid, force);
        },

        // (event) close others tabs
        closeOthers: function(e) {
            this.tabs.closeOthers(this.tabid);
        }
    });

    return TabView;
});