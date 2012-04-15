/*globals jQuery, Backbone, moment */
(function ($) {
    'use strict';

    var daynum,
        weekNum,
        weeksBack = 7,
        daysArray = [],
        weeksArray = [],
        userSettingsArray,
        userSettingsArrayLen,
        userSettingsObj = {},
        start,
        f,
        AppView,
        AppModel,
        AppRouter,

        OfficeEditView,
        OfficesView, // list
        OfficesItemView,
        OfficeModel,
        OfficeCollection,

        TimesheetItemView,
        TimesheetItemItemView,
        TimesheetDayView, // list
        TimesheetDayItemView,
        TimesheetWeekView, // list
        TimesheetWeekItemView,
        TimesheetWeeksView, // list
        TimesheetWeeksItemView,
        TimesheetItemModel,
        TimesheetItemCollection, // all entries, views format this
        TimesheetWeeksCollection,
        HeaderModel,

        SettingsView,
        HelpView,
        GenericCollectionView,
        HeaderView,

        UserSettingsModel,
        appView,
        appRouter,
        appModel,
        officeCollection,
        timesheetItemCollection,
        helpModel,
        userSettingsModel,
        headers = {
            "timesheets": {
                title: "Timesheets",
                titleClass: "centre",
                buttons: []
            },
            "timesheets-week": {
                title: function (weekNum, dayNum, itemNum) {
                    var week = weeksArray[weekNum],
                        weekString;

                    weekString = "Week " + week.days[0].date.format("D") + "-" + week.days[6].date.format("D MMM");
                    return weekString;
                },
                titleClass: "right",
                buttons: [{
                    title: "Timesheets",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "timesheets-day": {
                title: function (weekNum, dayNum, itemNum) {
                    var day = weeksArray[weekNum].days[dayNum],
                        dayString;

                    dayString = day.date.format("ddd Do MMM");
                    return dayString;
                },
                titleClass: "right",
                buttons: [{
                    title: "Week",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "timesheets-item": {
                title: function (weekNum, dayNum, itemNum) {
                    var item = weeksArray[weekNum].days[dayNum].timesheets[itemNum],
                        startDateTime = moment(new Date(item.startDateTime)),
                        endDateTime = moment(new Date(item.endDateTime)),
                        itemString;

                    itemString = startDateTime.format("H:mm") + "-" + endDateTime.format("H:mm ddd Do MMM");
                    return itemString;
                },
                titleClass: "right",
                buttons: [{
                    title: "Day",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "timesheets-add": {
                title: function (weekNum, dayNum, itemNum) {
                    var day = weeksArray[weekNum].days[dayNum],
                        dayString;

                    dayString = day.date.format("ddd Do MMM");
                    return dayString;
                },
                titleClass: "right",
                buttons: [{
                    title: "Day",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "offices": {
                title: "Offices",
                titleClass: "centre",
                buttons: [
                    {
                        title: "Edit",
                        buttonClass: "bordered edit edit-offices"
                    },
                    {
                        title: "+",
                        href: "/page/offices-add",
                        buttonClass: "bordered add add-office right animate-slideForward"
                    }
                ]
            },
            "offices-add": {
                title: "Add Office",
                buttons: [{
                    title: "Offices",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "offices-add-map": {
                title: "Add From Map",
                buttons: [{
                    title: "Add Office",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "offices-add-current": {
                title: "Add From Current Location",
                buttons: [{
                    title: "Add Office",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "offices-edit": {
                title: "Edit Office",
                buttons: [
                    {
                        title: "Offices",
                        buttonClass: "back bordered animate-slideBack"
                    },
                    {
                        title: "Delete",
                        buttonClass: "bordered delete delete-office right animate-slideBack"
                    }
                ]
            },
            "offices-add-address": {
                title: "Add From Address",
                buttons: [{
                    title: "Add Office",
                    buttonClass: "back bordered animate-slideBack"
                }]
            },
            "help": {
                title: "Help",
                buttons: []
            },
            "settings": {
                title: "Settings",
                buttons: []
            }
        },
        faqs = [
            {
                question: "How do I update a timesheet?",
                answer: "Use edit button..."
            },
            {
                question: "What extra features does the paid app have?",
                answer: "Automatically sends you timesheets, no ads."
            },
            {
                question: "Question 3?",
                answer: "Answer 3."
            }
        ],
        activeClass = "active",
        mydate,
        formatTimesheetsMinutes,
        getTimesheetsMinutes,
        timesheets = [
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Mon Mar 05 2012 08:45:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Mon Mar 05 2012 18:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Tue Mar 06 2012 08:45:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Tue Mar 06 2012 18:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Wed Mar 07 2012 08:45:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Wed Mar 07 2012 18:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Thu Mar 08 2012 08:45:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Thu Mar 08 2012 12:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Thu Mar 08 2012 12:30:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Thu Mar 08 2012 18:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Fri Mar 09 2012 08:45:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Fri Mar 09 2012 12:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Fri Mar 09 2012 12:30:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Fri Mar 09 2012 16:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Sun Mar 11 2012 09:00:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Sun Mar 11 2012 11:30:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Liverpool st", // string primary key
                startDateTime: "Sun Mar 11 2012 12:30:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Sun Mar 11 2012 17:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Holt st", // string primary key
                startDateTime: "Mon Mar 26 2012 09:00:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Mon Mar 26 2012 11:30:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Holt st", // string primary key
                startDateTime: "Mon Mar 26 2012 12:30:00 GMT+1100 (EST)", // datetime string
                endDateTime: "Mon Mar 26 2012 17:00:00 GMT+1100 (EST)" // datetime string
            },
            {
                locationName: "NDM Holt st", // string primary key
                startDateTime: "Sat Apr 7 2012 09:00:00 GMT+1000 (EST)", // datetime string
                endDateTime: "Sat Apr 7 2012 11:30:00 GMT+1000 (EST)" // datetime string
            },
            {
                locationName: "NDM Holt st", // string primary key
                startDateTime: "Sat Apr 7 2012 12:30:00 GMT+1000 (EST)", // datetime string
                endDateTime: "Sat Apr 7 2012 17:00:00 GMT+1000 (EST)" // datetime string
            }
        ],
        offices = [
            {
                locationName: "NDM Holt st",
                companyName: "News Digital Media",
                address: "120 Somewhere, Surry Hills",
                lat_lng: [124.435, 98.454],
                officeNum: 0
            },
            {
                locationName: "NDM Liverpool st",
                companyName: "News Digital Media",
                address: "Level 23, 175 Liverpool Street Sydney NSW 2001",
                lat_lng: [114.435, 93.454],
                officeNum: 1
            }
        ],
        clickTouchEvent = "touchend";


    getTimesheetsMinutes = function (timesheets) {
        var minutesTotal = 0,
            timesheetsLen = timesheets.length,
            timesheet,
            start,
            stop,
            diff,
            i;

        for (i = 0; i < timesheetsLen; i = i + 1) {
            timesheet = timesheets[i];
            start = new Date(timesheet.startDateTime);
            stop = new Date(timesheet.endDateTime);
            diff = parseInt((stop - start) / 1000 / 60, 10); // in minutes
            minutesTotal = minutesTotal + diff;
        }

        return minutesTotal;
    };

    formatTimesheetsMinutes = function (minutes) {
        var hoursFormatted;

        hoursFormatted = Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";

        return hoursFormatted;
    };

    /*
    User Settings for the app
    - updated by user
    - directly in settings area, or by actions
    */
    UserSettingsModel = Backbone.Model.extend({
        defaults: {
            start: "offices", // changes to timesheets when user has an office, or user can hardcode where to start
            updateInterval: "15", // minutes
            range: "100", // range in metres used to determine if at office or not
            hoursWeek: "37.5", // used to display if over/under normal working hours for the week
            hoursDay: "7.5", // used to display if over/under normal working hours for the day
            weekStart: "0", // which day of the week to start at for week display 0-6 for Sun-Sat
            paidApp: "1", // whether or not the app is the paid version
            email: ""
        }
    });

    /*
    Main app data stored here
    - Offices list
    - Timesheets list
    - User Settings
    */
    AppModel = Backbone.Model.extend({
        defaults: {
            menuItems: ["offices", "timesheets", "help", "settings"],
            selectedPage: "",
            selectedTimesheetWeek: "",
            selectedTimesheetDay: "",
            selectedTimesheetItem: "",
            selectedOffice: ""
        }
    });

    OfficeModel = Backbone.Model.extend({
        locationName: null, // string primary key
        companyName: null, // string
        address: null, // string
        lat_lng: null // array
    });

    TimesheetItemModel = Backbone.Model.extend({
        locationName: null, // string primary key
        startTime: null, // datetime string
        endTime: null // datetime string
    });

    HeaderModel = Backbone.Model.extend({
        title: null, // string
        buttons: null // array
    });

    GenericCollectionView = Backbone.View.extend({
        initialize: function (options) {
            //console.log("GenericCollectionView initialize", this, options);
            _(this).bindAll("add", "remove");

            if (!options.childViewConstructor) {
                throw "no childViewConstructor provided";
            }
            if (!options.childViewTagName) {
                throw "no childViewTagName provided";
            }

            this.childViewConstructor = options.childViewConstructor;
            this.childViewTagName = options.childViewTagName;
            this.childViews = [];

            this.collection.each(this.add);

            this.collection.on("add", this.add);
            this.collection.on("remove", this.remove);

            this.render();
        },

        add: function (model) {
            var childView = new this.childViewConstructor({
                tagName: this.childViewTagName,
                model: model
            });

            this.childViews.push(childView);

            if (this.rendered) {
                $(this.el).append(childView.render().el);
            }
        },

        remove: function (model) {
            var viewToRemove = _(this.childViews).select(function (view) {
                return view.model === model;
            })[0];

            this.childViews = _(this.childViews).without(viewToRemove);

            if (this.rendered) {
                $(viewToRemove.el).remove();
                viewToRemove.unbind();
            }
        },

        render: function () {
            var that = this;

            that.rendered = true;
            $(that.el).empty();

            _(that.childViews).each(function (childView) {
                $(that.el).append(childView.render().el);
            });

            return that;
        }
    });

    TimesheetWeeksCollection = Backbone.Collection.extend({
        comparator: function (week) {
            // so weeks display in reverse order
            return week.get("weekNum");
        }
    });

    OfficeCollection = Backbone.Collection.extend({
        model: OfficeModel
    });

    TimesheetItemCollection = Backbone.Collection.extend({
        model: TimesheetItemModel
    });

    OfficeEditView = Backbone.View.extend({
        el: $("#offices-edit"),
        template: _.template($("#tmpl-office-edit").html()),
        render: function () {
            //console.log("OfficeEditView render called", this);
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    HelpView = Backbone.View.extend({
        el: $("#help"),
        template: _.template($("#tmpl-help").html()),
        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    HeaderView = Backbone.View.extend({
        model: HeaderModel,
        el: $("header"),
        template: _.template($("#tmpl-header").html()),
        render: function () {
            //console.log("HeaderView render method", this.model);
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    SettingsView = Backbone.View.extend({
        el: $("#settings"),
        template: _.template($("#tmpl-user-settings").html()),

        initialize: function (options) {
            var that = this;
            that.model.on("change", that.change, that);
        },

        change: function () {
            $(document).trigger("updateUserSettings");
        },

        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    TimesheetWeeksView = GenericCollectionView.extend({
        el: $("#timesheets .list"),
        events: {}
    });

    TimesheetWeekView = GenericCollectionView.extend({
        el: $("#timesheets-week .list"),
        events: {}
    });

    TimesheetDayView = GenericCollectionView.extend({
        el: $("#timesheets-day .list"),
        events: {},
        noTimesheets: function () {
            //console.log("TimesheetDayView noTimesheets", this);
            $(this.el).parent().find(".message").remove();
            $(this.el).parent().append('<div class="message"><p>no timesheets</p><p><a class="animate-slideForward button button-add button-add-timesheet" data-href="page/timesheets-add">Add a timesheet</a></p>');
        }
    });

    OfficesView = GenericCollectionView.extend({
        el: $("#offices .list"),
        events: {}
    });

    TimesheetWeeksItemView = Backbone.View.extend({
        className: "row",
        template: _.template($("#tmpl-timesheets").html()),
        render: function () {
            var daterange,
                hoursFormatted,
                hasTimesheets = this.model.get("hasTimesheets"),
                i,
                j,
                weekNum,
                days,
                dayTimesheets,
                weekTimesheets = [],
                timesheetsLen,
                timesheet,
                totalMinutes,
                userMinutesPerWeek = userSettingsModel.get("hoursWeek") * 60,
                overHours;

            weekNum = this.model.get("weekNum");
            days = this.model.get("days");
            daterange = days[0].date.format("D") + "-" + days[6].date.format("D MMMM YYYY");

            for (i = 0; i < 7; i = i + 1) {
                dayTimesheets = days[i].timesheets;
                timesheetsLen = dayTimesheets.length;

                for (j = 0; j < timesheetsLen; j = j + 1) {
                    timesheet = dayTimesheets[j];
                    weekTimesheets.push(timesheet);
                }
            }

            totalMinutes = getTimesheetsMinutes(weekTimesheets);
            overHours = (totalMinutes >= userMinutesPerWeek) ? true : false;
            hoursFormatted = formatTimesheetsMinutes(totalMinutes);

            $(this.el).html(this.template({
                weekNum: weekNum,
                daterange: daterange,
                hours: hoursFormatted,
                overHours: overHours
            }));

            return this;
        }
    });

    TimesheetWeekItemView = Backbone.View.extend({
        className: "row",
        template: _.template($("#tmpl-timesheets-week").html()),
        render: function () {

            var weekNum = this.model.get("weekNum"),
                dayslot = this.model.get("dayslot"),
                weekStart = parseInt(userSettingsModel.get("weekStart"), 10),
                date = this.model.get("date"),
                timesheets = this.model.get("timesheets"),
                timesheetsLen = timesheets.length,
                i,
                hoursFormatted,
                totalMinutes,
                overHours,
                timesheet,
                start,
                stop,
                diff,
                userMinutesPerDay = userSettingsModel.get("hoursDay") * 60;

            //console.log("TimesheetWeekItemView render model: ", this.model, dayslot);

            totalMinutes = getTimesheetsMinutes(timesheets);
            overHours = (totalMinutes >= userMinutesPerDay) ? true : false;
            hoursFormatted = formatTimesheetsMinutes(totalMinutes);

            $(this.el).html(this.template({
                weekNum: weekNum,
                dayNum: dayslot,
                date: date.format("Do"),
                dayName: date.format("ddd"),
                hours: hoursFormatted,
                overHours: overHours
            }));

            return this;
        }
    });

    TimesheetDayItemView = Backbone.View.extend({
        className: "row",
        template: _.template($("#tmpl-timesheets-day").html()),
        render: function () {

            //console.log("TimesheetWeekItemView render model: ", this.model);

            var weekNum = this.model.get("weekNum"),
                dayslot = this.model.get("dayslot"),
                itemNum = this.model.get("timesheetNum"),
                startDateTime = moment(new Date(this.model.get("startDateTime"))),
                endDateTime = moment(new Date(this.model.get("endDateTime"))),
                timeRange = startDateTime.format("H:mm") + "-" + endDateTime.format("H:mm"),
                locationName = this.model.get("locationName");

            $(this.el).html(this.template({
                weekNum: weekNum,
                dayNum: dayslot,
                itemNum: itemNum,
                timeRange: timeRange,
                office: locationName
            }));

            return this;
        }
    });

    TimesheetItemView = Backbone.View.extend({
        el: $("#timesheets-item"),
        template: _.template($("#tmpl-timesheets-item").html()),

        initialize: function (options) {
            console.log("TimesheetItemView initialize", appView, this, options);
            this.model.on("change", this.render);
            this.render();
        },

        render: function () {
            console.log("TimesheetItemView render model: ", this.model);
            var officesCollection = appView.model.get("officeCollection"),
                officesLen = officesCollection.length,
                obj = this.model.toJSON(),
                i;

            obj.offices = [];
            for (i = 0; i < officesLen; i = i + 1) {
                obj.offices.push(officesCollection.at(i).attributes);
            }

            $(this.el).html(this.template(obj));
            return this;
        }
    });

    OfficesItemView = Backbone.View.extend({
        className: "row",
        template: _.template($("#tmpl-office").html()),
        render: function () {
            //console.log("OfficesItemView render model: ", this.model);
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    AppRouter = Backbone.Router.extend({

        routes: {
            '' : 'start',
            '/' : 'start',

            // timesheet pages
            "weeks": "timesheets",
            "/weeks": "timesheets",
            "timesheets": "timesheets",
            "/timesheets": "timesheets",
            "week/:weekNum": "timesheetsWeek",
            "/week/:weekNum": "timesheetsWeek",
            "week/:weekNum/day/:dayNum": "timesheetsDay",
            "/week/:weekNum/day/:dayNum": "timesheetsDay",
            "week/:weekNum/day/:dayNum/item/:itemNum": "timesheetsItem",
            "/week/:weekNum/day/:dayNum/item/:itemNum": "timesheetsItem",

            // offices pages
            "offices": "offices",
            "/offices": "offices",
            "/offices/edit/:officeNum": "officeEdit",
            "offices/edit/:officeNum": "officeEdit",

            "/page/:id": "page",
            "page/:id": "page",

            // general pages
            "help": "help",
            "/help": "help",
            "settings": "settings",
            "/settings": "settings"
        },

        initialize: function (options) {
            console.log("router initialize", this, options);
        },

        hideShow: function (id) {
            var elem = $("#" + id)[0];
            this.hideSections();
            this.showSection(id);
        },

        hideSections: function () {
            var animation = appView.model.get("animationType"),
                animationClass = "",
                remove,
                $active = $('body section.active');

            // FIX ME!!
            if (animation === "slideBack") {
                animationClass = "slideOutToRight";
            } else if (animation === "slideForward") {
                animationClass = "slideOutToLeft";
            } else if (animation === "fade") {
                animationClass = "fadeOut";
            }

            $('body section').removeClass(activeClass + " fadeOut fadeIn slideOutToRight slideOutToLeft slideInFromRight slideInFromLeft");
            $('body footer a[data-href]').removeClass(activeClass);

            $active.addClass(animationClass);
        },

        showSection: function (id) {
            var idParts = id.split("-"),
                idPartsLen = idParts.length,
                section,
                animation = appView.model.get("animationType"),
                animationClass = "";

            // FIX ME!!
            if (animation === "slideBack") {
                animationClass = "slideInFromLeft";
            } else if (animation === "slideForward") {
                animationClass = "slideInFromRight";
            } else if (animation === "fade") {
                animationClass = "fadeIn";
            }

            section = (idPartsLen > 1) ? idParts[0] : id;
            $('#' + id).addClass(animationClass + " active");
            $('footer a[data-href="page/' + section + '"]').addClass(activeClass);
        },

        start: function () {
            var start = appView.model.get("userSettingsModel").get("start");
            this.page(start);
        },

        page: function (id) {
            console.log("AppRouter page method fired...", this);
            appView.model.set("selectedPage", id);
            this.hideShow(id);
        },

        timesheetsWeek: function (weekNum) {
            //console.log("AppRouter timesheetsWeek method fired...", this);
            appView.model.set("selectedTimesheetWeek", weekNum);
            appView.model.set("selectedPage", "timesheets-week");
            this.hideShow("timesheets-week");
        },

        timesheetsDay: function (weekNum, dayNum) {
            //console.log("AppRouter timesheetsDay method fired...", this);
            appView.model.set("selectedTimesheetWeek", weekNum);
            appView.model.set("selectedTimesheetDay", dayNum);
            appView.model.set("selectedPage", "timesheets-day");
            this.hideShow("timesheets-day");
        },

        timesheetsItem: function (weekNum, dayNum, itemNum) {
            //console.log("AppRouter timesheetsItem method fired...", this);
            appView.model.set("selectedTimesheetWeek", weekNum);
            appView.model.set("selectedTimesheetDay", dayNum);
            appView.model.set("selectedTimesheetItem", itemNum);
            appView.model.set("selectedPage", "timesheets-item");
            this.hideShow("timesheets-item");
        },

        officeEdit: function (officeNum) {
            //console.log("AppRouter officeEdit method fired...", this, officeNum);
            appView.model.set("selectedOffice", officeNum);
            appView.model.set("selectedPage", "offices-edit");
            this.hideShow("offices-edit");
        }

    });

    AppView = Backbone.View.extend({
        el: $("#timesheet-app"),

        events: {},

        initialize: function (options) {

            var that = this,
                helpView,
                settingsView;

            if (!options.model) {
                throw "no app model provided";
            }
            if (!this.model.get("officeCollection")) {
                throw "no officeCollection provided";
            }
            if (!this.model.get("timesheetItemCollection")) {
                throw "no timesheetItemCollection provided";
            }
            if (!this.model.get("userSettingsModel")) {
                throw "no userSettingsModel provided";
            }

            that.placeAnchorHooks();

            weeksArray = this.setupWeeks();

            that.timesheetWeeksCollection = new TimesheetWeeksCollection();
            that.timesheetWeekCollection = new Backbone.Collection();
            that.timesheetDayCollection = new Backbone.Collection();

            that.timesheetWeeksView = new TimesheetWeeksView({
                collection: that.timesheetWeeksCollection,
                childViewConstructor: TimesheetWeeksItemView,
                childViewTagName: "li"
            });

            that.timesheetWeekView = new TimesheetWeekView({
                collection: that.timesheetWeekCollection,
                childViewConstructor: TimesheetWeekItemView,
                childViewTagName: "li"
            });

            that.timesheetDayView = new TimesheetDayView({
                collection: that.timesheetDayCollection,
                childViewConstructor: TimesheetDayItemView,
                childViewTagName: "li"
            });

            that.officesView = new OfficesView({
                collection: that.model.get("officeCollection"),
                childViewConstructor: OfficesItemView,
                childViewTagName: "li"
            });

            that.headerView = new HeaderView({
                model: new Backbone.Model({})
            });

            helpView = new HelpView({
                model: new Backbone.Model({faqs: faqs})
            }).render();

            settingsView = new SettingsView({
                model: that.model.get("userSettingsModel")
            }).render();

            that.model.set("appView", that);
            that.model.set("helpView", helpView);
            that.model.set("settingsView", settingsView);

            that.model.on("change:selectedPage", that.changePage);

            $(document).bind("updateUserSettings", function (e) {
                that.refreshApp();
            });

            $("#form-user-settings").live("submit", function (e) {
                e.preventDefault();
                that.updateUserSettings($(this).serializeArray());
            });

            $("#form-timesheet-update").live("submit", function (e) {
                e.preventDefault();
                that.updateTimesheet($(this).serializeArray());
            });

            //that.model.set("selectedPage", that.model.get("userSettingsModel").get("start"));
        },

        updateTimesheet: function (timesheetArray) {
            console.log("timesheetArray", timesheetArray, this);

            var i,
                iLen = timesheetArray.length,
                settingName,
                settingValue,
                timesheetsCollection = this.model.get("timesheetItemCollection"),
                oldStartDateTime,
                oldEndDateTime,
                newStartDateTime,
                newEndDateTime,
                timesheet,
                newTimesheet,
                currentValue,
                timesheetObj = {};


            for (i = 0; i < iLen; i = i + 1) {
                settingName = timesheetArray[i].name;
                settingValue = timesheetArray[i].value;
                timesheetObj[settingName] = settingValue;
            }

            timesheet = timesheetsCollection.at(timesheetObj.timesheetCount);
            oldStartDateTime = moment(new Date(timesheetObj.startDateTime));
            oldEndDateTime = moment(new Date(timesheetObj.endDateTime));

            newStartDateTime = oldStartDateTime.hours(timesheetObj["startDateTime-hour"]);
            newStartDateTime = newStartDateTime.minutes(timesheetObj["startDateTime-minute"]);
            newEndDateTime = oldEndDateTime.hours(timesheetObj["endDateTime-hour"]);
            newEndDateTime = newEndDateTime.minutes(timesheetObj["endDateTime-minute"]);

            newTimesheet = {
                locationName: timesheetObj.locationName,
                startDateTime: newStartDateTime.toDate().toString(),
                endDateTime: newEndDateTime.toDate().toString()
            };

            timesheet.set(newTimesheet);
            this.refreshApp();
            window.history.back();
        },

        setupWeeks: function () {
            var that = this,
                weekStart = parseInt(this.model.get("userSettingsModel").get("weekStart"), 10),
                weekNum,
                dayNum,
                timesheetNum,
                daysLen,
                weeksArray = [],
                weeksLen = weeksBack + 1, // current week plus archive
                myday,
                dayslot,
                diff,
                mydate,
                day,
                dayTimesheets,
                i,
                j;

            // create days and weeks arrays for comparison with saved timesheets
            // week 0 is current week, week 1 is 1 week back etc
            for (weekNum = 0; weekNum < weeksLen; weekNum = weekNum + 1) {
                weeksArray[weekNum] = {weekNum: weekNum, days: [], hasTimesheets: false};

                j = 0;                

                for (dayNum = weekStart; dayNum <= 6 + weekStart; dayNum = dayNum + 1) {
                    diff = 0;
                    if (dayNum > 6) {
                        myday = -(6 - (dayNum - 1));
                        diff = dayNum - myday;
                    } else {
                        myday = dayNum;
                    }

                    //mydate = moment().add("days", weekNum * 7 - (weeksBack * 7));
                    mydate = moment().add("days", -(weekNum * 7) + diff);
                    mydate = mydate.day(myday).hours(0).minutes(0).seconds(0);

                    weeksArray[weekNum].days.push({
                        date: mydate,
                        timesheets: [],
                        weekNum: weekNum,
                        dayNum: myday,
                        dayslot: j
                    });

                    daysArray.push({
                        weeknum: weekNum,
                        daynum: myday,
                        date: mydate,
                        dayslot: j,
                        timesheets: []
                    });

                    j = j + 1;
                }
            }

            daysLen = daysArray.length;

            // for each day check if timesheets exist, add to arrays if so
            for (i = 0; i < daysLen; i = i + 1) {
                day = daysArray[i].date.toDate();
                dayTimesheets = [];

                timesheetNum = 0;

                _.each(that.model.get("timesheetItemCollection").models, function (model, count) {
                    var modelDay = new Date(model.get("startDateTime")),
                        start,
                        stop,
                        weekNum,
                        dayNum;

                    modelDay.setHours(0, 0, 0, 0);

                    weekNum = daysArray[i].weeknum;
                    dayNum = daysArray[i].daynum;

                    dayslot = parseInt(dayNum, 10) - weekStart;

                    if (dayslot < 0) {
                        dayslot = dayslot + 7;
                    }

                    if (modelDay.toString() === day.toString()) {
                        start = model.get("startDateTime");
                        stop = model.get("endDateTime");
                        daysArray[i].timesheets.push({startDateTime: start, endDateTime: stop});
                        weeksArray[weekNum].hasTimesheets = true;
                        weeksArray[weekNum].days[dayslot].timesheets.push({
                            weekNum: weekNum,
                            dayNum: dayNum,
                            dayslot: dayslot,
                            timesheetNum: timesheetNum,
                            timesheetCount: count,
                            startDateTime: start,
                            endDateTime: stop,
                            locationName: model.get("locationName")
                        });

                        timesheetNum = timesheetNum + 1;
                    }
                });
            }

            return weeksArray;
        },

        updateUserSettings: function (newSettingsArray) {
            console.log("updateUserSettings", this, newSettingsArray);

            var i,
                iLen = newSettingsArray.length,
                settingName,
                settingValue,
                userSettingsModel = this.model.get("userSettingsModel"),
                currentValue,
                changed = false,
                changeObject = {};

            for (i = 0; i < iLen; i = i + 1) {
                settingName = newSettingsArray[i].name;
                settingValue = newSettingsArray[i].value;
                currentValue = userSettingsModel.get(settingName);

                if (currentValue.toString() !== settingValue.toString()) {
                    changed = true;
                    changeObject[settingName] = settingValue;
                }
            }

            if (changed) {
                window.localStorage['userSettings'] = JSON.stringify(newSettingsArray);
                userSettingsModel.set(changeObject);
            }

            window.history.back();
        },

        refreshApp: function () {
            console.log("refreshApp", this);

            var weeksCollection = this.timesheetWeeksCollection;

            weeksCollection.remove(weeksCollection.models);
            weeksArray = [];
            daysArray = [];
            weeksArray = this.setupWeeks();
            //weeksCollection.add(weeks);
            // make sure new settings are reflected in views...
            // may not actually need to "refresh" exactly, just make sure views are rendering
            // correctly based on the new settings
            // main issue will probably be the weeksArray with "start" day of the week
        },

        placeAnchorHooks : function () {
            var that = this;

            function getAnimationSetting(element) {
                var classes = $(element).attr("class"),
                    animate,
                    animationType = "";

                classes = classes.match(/animate-[\d,\w]*/gi);
                animate = (classes.length > 0) ? true : false;

                if (animate) {
                    animationType = classes[0].replace("animate-", "");
                    return animationType;
                } else {
                    return "none";
                }
            }

            // router hooks - change to touchstart event later
            $('[data-href]').live(clickTouchEvent, function () {
                var animationType = getAnimationSetting(this);
                that.model.set("animationType", animationType);
                appRouter.navigate($(this).attr('data-href'), true);
                //_.delay(function() { window.scrollTo(0, 0); }, 250);
            });

            // back button
            $(".back").live(clickTouchEvent, function () {
                var animationType = getAnimationSetting(this);
                that.model.set("animationType", animationType);
                window.history.back();
            });

            // provide touchstart class for styling
            $('[data-href], .back, section .row').live("touchstart", function () {
                $(this).addClass("touchstart");
            });

            $('[data-href], .back, section .row').live("touchend", function () {
                $(this).removeClass("touchstart");
            });
        },

        changePage: function () {
            console.log("change page", this);

            var page = this.get("selectedPage"),
                weeks,
                week,
                day,
                item,
                weekNum,
                dayNum,
                itemNum,
                weeksCollection,
                weekCollection,
                dayCollection,
                timesheet,
                timesheetModel,
                timesheetItemView,
                officeNum,
                office,
                officeModel,
                officeEditView,
                headerView;

            if (page === "timesheets") {
                weeks = weeksArray;
                weeksCollection = this.get("appView").timesheetWeeksCollection;
                weeksCollection.remove(weeksCollection.models);
                weeksCollection.add(weeks);
            }

            if (page === "timesheets-week") {
                week = weeksArray[this.get("selectedTimesheetWeek")];
                weekCollection = this.get("appView").timesheetWeekCollection;
                weekCollection.remove(weekCollection.models);
                weekCollection.add(week.days);
            }

            if (page === "timesheets-day") {
                weekNum = this.get("selectedTimesheetWeek");
                dayNum = this.get("selectedTimesheetDay");
                day = weeksArray[weekNum].days[dayNum];
                dayCollection = this.get("appView").timesheetDayCollection;

                dayCollection.remove(dayCollection.models);
                dayCollection.add(day.timesheets);

                if (day.timesheets.length === 0) {
                    this.get("appView").timesheetDayView.noTimesheets();
                } else {
                    $(this.get("appView").timesheetDayView.el).parent().find(".message").remove();
                }
            }

            if (page === "timesheets-item") {
                weekNum = this.get("selectedTimesheetWeek");
                dayNum = this.get("selectedTimesheetDay");
                itemNum = this.get("selectedTimesheetItem");
                timesheet = weeksArray[weekNum].days[dayNum].timesheets[itemNum];
                timesheet.dayNum = dayNum;
                timesheet.itemNum = itemNum;
                timesheetModel = new TimesheetItemModel(timesheet);
                timesheetItemView = new TimesheetItemView({model: timesheetModel});
            }

            if (page === "offices-edit") {
                officeNum = this.get("selectedOffice");
                office = offices[officeNum];
                officeModel = new OfficeModel(office);
                officeEditView = new OfficeEditView({model: officeModel}).render();
            }

            headerView = this.get("appView").headerView;
            headerView.model.set(headers[page]);
            headerView.model.set({
                weekNum: this.get("selectedTimesheetWeek"),
                dayNum: this.get("selectedTimesheetDay"),
                itemNum: this.get("selectedTimesheetItem")
            });
            headerView.render();
        }

    });

    // start at timesheets page if offices exist already
    if (offices.length > 0) {
        start = "timesheets";
    } else {
        start = "offices";
    }

    userSettingsArray = (window.localStorage.userSettings) ? JSON.parse(window.localStorage.userSettings) : [];
    userSettingsArrayLen = userSettingsArray.length;

    userSettingsObj.start = start;
    for (f = 0; f < userSettingsArrayLen; f = f + 1) {
        userSettingsObj[userSettingsArray[f].name] = userSettingsArray[f].value;
    }

    // create all models, collections, routers for app model
    userSettingsModel = new UserSettingsModel(userSettingsObj);
    officeCollection = new OfficeCollection(offices);

    timesheetItemCollection = new TimesheetItemCollection();
    timesheetItemCollection.add(timesheets);

    appModel = new AppModel({
        officeCollection: officeCollection,
        timesheetItemCollection: timesheetItemCollection,
        userSettingsModel: userSettingsModel
    });

    // create app
    appView = new AppView({
        model: appModel
    });

    appRouter = new AppRouter();
    Backbone.history.start({pushState: true});

}(jQuery));