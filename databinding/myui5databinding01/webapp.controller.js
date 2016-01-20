sap.ui.controller("myui5databinding01.webapp", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf myui5databinding01.webapp
     */
//	onInit: function() {
//
//	},

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf myui5databinding01.webapp
     */
//	onBeforeRendering: function() {
//
//	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf myui5databinding01.webapp
     */
//	onAfterRendering: function() {
//
//	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf myui5databinding01.webapp
     */
//	onExit: function() {
//
//

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf db1.App
     */
//	onBeforeRendering: function() {
//
//	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf db1.App
     */
//	onAfterRendering: function() {
//
//	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf db1.App
     */
//	onExit: function() {
//
//	}

    formatMapUrl: function (sStreet, sZip, sCity, sCountry) {
        return "https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=500x300&markers="
            + jQuery.sap.encodeURL(sStreet + ", " + sZip + " " + sCity + ", " + sCountry);
    },

    formatStockValue: function (fUnitPrice, iStockLevel, sCurrCode) {
        var sBrowserLocale = sap.ui.getCore().getConfiguration().getLanguage();
        var oLocale = new sap.ui.core.Locale(sBrowserLocale);
        var oLocaleData = new sap.ui.core.LocaleData(oLocale);
        var oCurrency = new sap.ui.model.type.Currency(oLocaleData.mData.currencyFormat);
        return oCurrency.formatValue([fUnitPrice * iStockLevel, sCurrCode], "string");
    }
});