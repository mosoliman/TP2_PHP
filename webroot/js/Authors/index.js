
// Update the krajRegions data list
function getAuthors() {
    $.ajax({
        type: 'GET',
        url: urlToRestApi,
        dataType: "json",
        success:
                function (data) {
                    var authorTable = $('#authorData');
                    authorTable.empty();
                    $.each(data.authors, function (key, value)
                    {
                        var editDeleteButtons = '</td><td>' +
                                '<a href="javascript:void(0);" class="btn btn-warning" rowID="' +
                                    value.id + 
                                    '" data-type="edit" data-toggle="modal" data-target="#modalAuthorAddEdit">' + 
                                    'edit</a>' +
                                '<a href="javascript:void(0);" class="btn btn-danger"' +
                                    'onclick="return confirm(\'Are you sure to delete data?\') ?' + 
                                    'authorAction(\'delete\', \'' + 
                                    value.id + 
                                    '\') : false;">delete</a>' +
                                '</td></tr>';
                        authorTable.append('<tr><td>' + value.id + '</td><td>' + value.name + editDeleteButtons);
 
                    });

                }

    });
}

 /* Function takes a jquery form
 and converts it to a JSON dictionary */
function convertFormToJSON(form) {
    var array = $(form).serializeArray();
    var json = {};

    $.each(array, function () {
        json[this.name] = this.value || '';
    });

    return json;
}


function authorAction(type, id) {
    id = (typeof id == "undefined") ? '' : id;
    var statusArr = {add: "added", edit: "updated", delete: "deleted"};
    var requestType = '';
    var authorData = '';
    var ajaxUrl = urlToRestApi;
    frmElement = $("#modalAuthorAddEdit");
    if (type == 'add') {
        requestType = 'POST';
        authorData = convertFormToJSON(frmElement.find('form'));
    } else if (type == 'edit') {
        requestType = 'PUT';
		ajaxUrl = ajaxUrl + "/" + id;
        authorData = convertFormToJSON(frmElement.find('form'));
    } else {
        requestType = 'DELETE';
        ajaxUrl = ajaxUrl + "/" + id;
    }
    frmElement.find('.statusMsg').html('');
    $.ajax({
        type: requestType,
        url: ajaxUrl,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(authorData),
        success: function (msg) {
            if (msg) {
                frmElement.find('.statusMsg').html('<p class="alert alert-success">Author data has been ' + statusArr[type] + ' successfully.</p>');
                getAuthors();
                if (type == 'add') {
                    frmElement.find('form')[0].reset();
                }
            } else {
                frmElement.find('.statusMsg').html('<p class="alert alert-danger">Some problem occurred, please try again.</p>');
            }
        }
    });
}

// Fill the krajRegion's data in the edit form
function editAuthor(id) {
    $.ajax({
        type: 'GET',
        url: urlToRestApi + "/" + id, //'authorAction.php',
        dataType: 'JSON',
   //     data: 'action_type=data&id=' + id,
        success: function (data) {
            $('#id').val(data.author.id);
            $('#name').val(data.author.name);
         //   $('#email').val(data.email);
         //   $('#phone').val(data.phone);
        }
    });
}

// Actions on modal show and hidden events
$(function () {
    $('#modalAuthorAddEdit').on('show.bs.modal', function (e) {
        var type = $(e.relatedTarget).attr('data-type');
        var authorFunc = "authorAction('add');";
        $('.modal-title').html('Add new author');
        if (type == 'edit') {
            authorFunc = "authorAction('edit');";
            var rowId = $(e.relatedTarget).attr('rowID');
			authorFunc = "authorAction('edit', " + rowId + ");";
			$('.modal-title').html('Edit author');					
            editAuthor(rowId);
        }
        $('#authorSubmit').attr("onclick", authorFunc);
    });

    $('#modalAuthorAddEdit').on('hidden.bs.modal', function () {
        $('#authorSubmit').attr("onclick", "");
        $(this).find('form')[0].reset();
        $(this).find('.statusMsg').html('');
    });
});