(function($, undefined) {
    document.addEventListener("touchstart", function() {}, false);

    var Settings,
        List,
        Week,
        Weeks,
        WeeksCollection,
        Day,
        Days,
        DaysCollection,
        Entry,
        Entries,
        EntriesCollection,
        Office,
        Offices,
        OfficesCollection,
        AppView,
        Row,
        Router,
        activeClass = "active",
        startid = "timesheets",
        headers = {
            // offices area
            offices: [],
            add: [],
            current: [],
            map: [],
            address: [],
            
            // timesheets area
            timesheets: [],
            week: [],
            day: []
            
            // help area
            
            // settings area
        },
        ControlView,
        ControlModel,
        Title,
        Button;
    
    
    // models
    Settings = Backbone.Model.extend({
        sync: function(method, model, options) {
            switch(method) {
                case 'create':
                case 'update':
                    localStorage.setItem('Settings', JSON.stringify(model));
                    break;
                case 'delete':
                    localStorage.removeItem('Settings');
                    break;
                case 'read':
                    var settings = localStorage.getItem('Settings');
                    model.attributes = (settings && JSON.parse(settings)) || {};
            }
            return this;
        }
    });
    
    ControlModel = Backbone.Model.extend({
    
        initialize: function() {
            this.type = "control";
        }
    
    });
    
    ButtonModel = Backbone.Model.extend({
    
        initialize: function() {
            this.type = "button";
        }
    
    });
    
    TitleModel = Backbone.Model.extend({
    
        initialize: function() {
            this.type = "title";
        }
    
    });
    
    Office = Backbone.Model.extend({
    
        initialize: function() {
            this.type = "office";
        }
    
    });
    
    Week = Backbone.Model.extend({
    
        initialize: function() {
            this.type = "week";
        }
    
    });
    
    Day = Backbone.Model.extend({
    
        initialize: function() {
            this.type = "day";
        }
    
    });
    
    Entry = Backbone.Model.extend({
    
        initialize: function() {
            this.type = "entry";
        }
    
    });
    
    
    // collections
    ButtonsCollection = Backbone.Collection.extend({
        model: ButtonModel
    });
    
    TitlesCollection = Backbone.Collection.extend({
        model: TitleModel
    });
    
    OfficesCollection = Backbone.Collection.extend({
        model: Office
    });
    
    WeeksCollection = Backbone.Collection.extend({
        model: Week
    });
    
    DaysCollection = Backbone.Collection.extend({
        model: Day
    });
    
    EntriesCollection = Backbone.Collection.extend({
        model: Entry
    });
    

    // views
    AppView = Backbone.View.extend({
        el: $("body"),
        
        initialize: function() {
            window.Offices.bind('add',   this.addItem, this);
            window.Offices.bind('reset', this.addOffices, this);
            window.Offices.bind('all',   this.render, this);
            window.Weeks.bind('add',   this.addItem, this);
            window.Days.bind('add',   this.addItem, this);
            window.Days.bind('remove',   this.removeItem, this);
            window.Entries.bind('add',   this.addItem, this);
            window.Entries.bind('remove',   this.removeItem, this);
            window.Days.bind('reset',   this.resetDays, this);
            window.Days.bind('reset',   this.resetEntries, this);
            
            window.Buttons.bind('add',   this.addItem, this);
            window.Titles.bind('add',   this.addItem, this);
            
            // hardcoded, get correct offices and weeks from storage
            window.Offices.add([
                {name: "NDM Liverpool St"},
                {name: "NDM Holt St"}
            ]);
            
            window.Weeks.add([
                {date: "5-11 September 2011", duration: "40h 30m"},
                {date: "12-18 September 2011", duration: "36h 30m"}
            ]);
            
            window.Buttons.add([
                {text: "Edit"}
            ]);
            
            window.Titles.add([
                {text: "Timesheets"}
            ]);
            
            window.Buttons.add([
                {text: "+"}
            ]);
            
        },
        render: function() {},
        
        addOffices: function(itemCollection) {
            window.Offices.each(this.addOffice);
        },
        
        addItem: function(model) {
            
            if (model.type === "office") {
                var view = new OfficeRow({model: model, id: "row-" + model.cid});
                this.$("section#offices .list").append(view.render().el);
            } else if (model.type === "week") {
                var view = new WeekRow({model: model, id: "row-" + model.cid});
                this.$("section#timesheets .list").append(view.render().el);
            } else if (model.type === "day") {
                var view = new DayRow({model: model, id: "row-" + model.cid});
                this.$("section#week .list").append(view.render().el);
            } else if (model.type === "entry") {
                var view = new EntryRow({model: model, id: "row-" + model.cid});
                this.$("section#day .list").append(view.render().el);
            } else if (model.type === "button") {
                var view = new Button({model: model, id: "btn-" + model.cid});
                this.$("header").append(view.render().el);
            } else if (model.type === "title") {
                var view = new Title({model: model, id: "btn-" + model.cid});
                this.$("header").append(view.render().el);
            }

        },
        
        removeItem: function(itemModel) {
            $("#row-" + itemModel.cid).remove();
        },
        
        placeAnchorHooks : function() {
            $('[data-href]').bind('click',function() {
                App.Router.navigate( $(this).attr('data-href'), true );
                _.delay(function() { window.scrollTo(0, 0); }, 250);
            });
        },
        
        resetDays: function(collection) {
            $("#week .row").remove();
        },
        resetEntries: function(collection) {
            $("#day .row").remove();
        }
        
    });
    
    Title = Backbone.View.extend({
        
        tagName: "h1",
        template: _.template($("#tmpl-control").html()),
        
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    
    });
    
    Button = Backbone.View.extend({
        
        tagName: "button",
        template: _.template($("#tmpl-control").html()),
        
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    
    });
    
    Edit = Button.extend({
        className: "btn btn-edit"
    });
    
    Back = Button.extend({
        className: "btn btn-back"
    });
    
    Row = Backbone.View.extend({
    
        tagName: "li",
        className: "row",
        
        initialize: function() {
            //console.log("initialise Row view…", this.el);
            //this.model.bind('change', this.render, this);
            //this.render();
        },
        
        render: function() {
            //console.log(this.template);
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    
    });
    
    WeekRow = Row.extend({
        className: "row week",
        name: "WeekRow",
        model: Week,
        template: _.template($("#tmpl-week").html()),
        events: {
            "click": "open"//,
            //"click .button.edit": "openEditDialog",
            //"click .button.delete": "destroy"
        },
        
        open: function(elem) {
            window.App.Router.navigate("/timesheets/week", true);
        }
    });
    
    DayRow = Row.extend({
        name: "DayRow",
        className: "row day",
        model: Day,
        template: _.template($("#tmpl-day").html()),
        events: {
            "click": "open"
        },
        
        open: function(elem) {
            window.App.Router.navigate("/timesheets/day", true);
        }
    });
    
    EntryRow = Row.extend({
        name: "EntryRow",
        className: "row entry",
        model: Entry,
        template: _.template($("#tmpl-entry").html())
    });
    
    OfficeRow = Row.extend({
        name: "OfficeRow",
        className: "row office",
        model: Office,
        template: _.template($("#tmpl-office").html())
    });
    
    
    // router
    Router = Backbone.Router.extend({
        routes : {
            '' : 'start',
            '/' : 'start',
            ':id' : 'page',
            '/:id': 'page',
            '/timesheets/:id': 'page',
            'timesheets/:id': 'page',
            '/offices/:id': 'page',
            'offices/:id': 'page',
            '/offices/add/:id': 'page',
            'offices/add/:id': 'page'
        },
        
        hideAll : function() {
            $('body > section').removeClass(activeClass);
            $('body > footer a[data-href]').removeClass(activeClass);
        },
        
        start : function() {
            
            if (!window.Offices || window.Offices.length < 1) {
                startid = "offices";
            }
            
            this.page(startid);
        },
        
        page : function(id) {
            //console.log(id);
            this.hideAll();
            $('#' + id).addClass(activeClass);
            $('footer a[data-href=' + id + "]").addClass(activeClass);
            
            // hardcoded, lookup correct Days etc
            if (id === "week") {
                window.Days.reset();
                window.Days.add([
                    {name: "Mon", date: "19th", duration: "8h 30m"},
                    {name: "Tue", date: "20th", duration: "6h 30m"}
                ]);
            }
            
            if (id === "day") {
                window.Entries.reset();
                window.Entries.add([
                    {time: "08:45-12:00", location: "NDM Liverpool st"},
                    {time: "12:45-18:00", location: "NDM Liverpool st"},
                ]);
            }
        }
    
    });
    
    
    $(document).ready(function() {
        window.Offices = new OfficesCollection();
        window.Weeks = new WeeksCollection();
        window.Days = new DaysCollection();
        window.Entries = new EntriesCollection();
        window.Buttons = new ButtonsCollection();
        window.Titles = new TitlesCollection();
        
        window.App = new AppView;
        
        /*
        App.Settings = new Settings;
        App.Settings.fetch();
        */
        
        window.App.Router = new Router;
        Backbone.history.start({ pushState: true });
        
        App.placeAnchorHooks();
        
        setTimeout(function() { window.scrollTo(0, 0); }, 1000);
        $(window).bind('orientationchange', function() { scrollTo(0, 0); });
        
    });
})(jQuery);