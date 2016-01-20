sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/wt/controller/HelloDialog",
    "sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, JSONModel, HelloDialog, ODateModel) {
    "use strict";
    return UIComponent.extend("sap.ui.demo.wt.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            // set data model
            var oData = {
                recipient : {
                    name : "World"
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);
            // set invoice model - local
            var oConfig = this.getMetadata().getConfig();
            var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
            var oInvoiceModel = new JSONModel(jQuery.sap.getModulePath(sNamespace, oConfig.invoiceLocal));
            // set invoice model - remote
            var oConfig = this.getMetadata().getConfig();
            try {
                var oInvoiceModel = new ODataModel(oConfig.invoiceRemote);
                this.setModel(oInvoiceModel, "invoice");
            }catch (e){
                console.log(e)
            }
            //var oInvoiceModel = new ODataModel(oConfig.invoiceRemote);
            //this.setModel(oInvoiceModel, "invoice");
            // set dialog
            this.helloDialog = new HelloDialog();
        }
    });
});