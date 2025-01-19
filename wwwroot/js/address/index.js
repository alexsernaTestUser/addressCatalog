$(function () {
    // Datos iniciales
    const dataSource = new DevExpress.data.CustomStore({
        key: "addressID",
        load: () => {
            return fetch("/address/GetAll")
                .then((response) => response.json())
                .catch(() => { throw "Error al cargar los datos"; });
        }
    });

    // Obtener las ciudades y estados para llenar los combos
    let cities = [];
    let states = [];

    // Cargar ciudades
    function loadCities() {
        return fetch("/address/GetCities")
            .then(response => response.json())
            .then(data => {
                cities = data;
            })
            .catch(() => console.error("Error al cargar las ciudades"));
    }

    // Cargar estados
    function loadStates() {
        return fetch("/address/GetStates")
            .then(response => response.json())
            .then(data => {
                states = data;
            })
            .catch(() => console.error("Error al cargar los estados"));
    }

    // Objeto para vincular el formulario
    let selectedItem = null;

    // Form
    $("#form-container").dxForm({
        formData: {},
        colCount: 2,
        onInitialized: function (e) {
            Promise.all([loadCities(), loadStates()])
                .then(() => {
                    const formInstance = e.component;
                    $("#Layer_1").click();
                    formInstance.getEditor("city").option("dataSource", cities);
                    formInstance.getEditor("stateProvince").option("dataSource", states);
                })
                .catch((error) => {
                    console.error("Error al cargar las ciudades y/o estados", error);
                });
        },
        items: [
            {
                dataField: "addressLine1",
                editorType: "dxTextBox",
                disabled: true,
                label: { text: "Dirección" }
            },
            {
                dataField: "countryRegion",
                editorType: "dxTextBox",
                disabled: true,
                label: { text: "País" }
            },
            {
                dataField: "city",
                editorType: "dxSelectBox",
                label: { text: "Ciudad" },
                editorOptions: {
                    dataSource: cities,
                    value: ""
                }
            },
            {
                dataField: "stateProvince",
                editorType: "dxSelectBox",
                label: { text: "Estado/Provincia" },
                editorOptions: {
                    dataSource: states,
                    value: ""
                }
            },
            {
                dataField: "postalCode",
                editorType: "dxTextBox",
                disabled: true,
                label: { text: "Código Postal" }
            },
            {
                itemType: "button",
                horizontalAlignment: "right",
                buttonOptions: {
                    text: "Guardar Cambios",
                    type: "success",
                    onClick: function () {
                        const formInstance = $("#form-container").dxForm("instance");
                        const formData = formInstance.option("formData");

                        if (selectedItem) {
                            const url = `/address/EditAddress?id=${selectedItem.addressID}&city=${encodeURIComponent(formData.city)}&stateProvince=${encodeURIComponent(formData.stateProvince)}`;

                            fetch(url, {
                                method: "POST"
                            })
                                .then(response => {
                                    if (response.ok) {
                                        DevExpress.ui.notify("Registro actualizado exitosamente", "success", 2000);
                                        $("#grid-container").dxDataGrid("instance").refresh();

                                        formInstance.reset();
                                        selectedItem = null;
                                    } else {
                                        DevExpress.ui.notify("Error al actualizar el registro", "error", 2000);
                                    }
                                })
                                .catch(() => {
                                    DevExpress.ui.notify("Error de conexión", "error", 2000);
                                });
                        } else {
                            DevExpress.ui.notify("Selecciona un registro para editar", "warning", 2000);
                        }

                    }
                }
            }
        ]
    });


    // Configuración del dxDataGrid
    $("#grid-container").dxDataGrid({
        dataSource: dataSource,
        keyExpr: "addressID",
        showBorders: false,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        paging: { pageSize: 20 },
        searchPanel: { visible: true },
        editing: {
            mode: "row",
            allowUpdating: true
        },
        columns: [
            { dataField: "addressLine1", caption: "Dirección" },
            { dataField: "city", caption: "Ciudad" },
            { dataField: "stateProvince", caption: "Estado/Provincia" },
            { dataField: "countryRegion", caption: "País" },
            { dataField: "postalCode", caption: "Código Postal" },
            { dataField: "modifiedDate", caption: "Última Modificación", dataType: "date", format: "dd/MMM/yyyy HH:mm a" },
            {
                type: "buttons",
                buttons: [
                    {
                        text: "Editar",
                        hint: "Seleccionar registro",
                        onClick: function (e) {
                            selectedItem = e.row.data;
                            $("#form-container").dxForm("instance").option("formData", selectedItem);
                            DevExpress.ui.notify("Editando direccion " + selectedItem.addressLine1, "info", 2000);
                        }
                    }
                ]
            }
        ]
    });
});