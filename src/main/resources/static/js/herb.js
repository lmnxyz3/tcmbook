var tableData = [];

jQuery.fn.dataTableExt.oSort['chinese-string-asc'] = function(x, y) {
    x = (x instanceof Array) ? x[0] : x == '-' ? 'z' : x;
    y = (y instanceof Array) ? y[0] : y == '-' ? 'z' : y;
    return x.localeCompare(y);
};
jQuery.fn.dataTableExt.oSort['chinese-string-desc'] = function(x, y) {
    x = (x instanceof Array) ? x[0] : x == '-' ? 'z' : x;
    y = (y instanceof Array) ? y[0] : y == '-' ? 'z' : y;
    return y.localeCompare(x);
};

function search() {
    tableData = [];
    var url = window.location.href;
    var index = url.lastIndexOf("\/");
    var keyword = parseInt(url.substring(index+1, url.length));
    var json = {
        "keyword" : keyword
    };
    var sendData = JSON.stringify(json);
    $.ajax(
        {
            data: sendData,
            url:"./getHerbRelate",
            contentType:"application/json;charset=utf-8",
            type:"POST",
            success:function (data) {
                if(data.length!==0){
                    var id = 0;
                    data.forEach(function (value) {
                        if(value['compound_name']!=null){
                            if(value['compound_id']<0){
                                value['compound_id']=-value['compound_id'];
                                value['compoundlink'] = '<a href=\"../ingredient/' +value['compound_id'] + '" target="_blank">'+ value['compound_name']+ '</a>';
                            }
                            else value['compoundlink'] = '<a href=\"../compound/' +value['compound_id'] + '" target="_blank">'+ value['compound_name']+ '</a>';
                        }
                        console.log(value);
                        tableData.push(value);

                    });
                    if(tableData.length===0)
                        $('#table-container').hide();
                    else{
                        $('#table-container').show();
                        showTable(tableData);
                    }
                }
            }
        }
    );
}

function addHold(tbody) {
    tbody.on('click','tr',function () {
        var medicine = $(this).children('td').get(0).innerText;
        var compound = $(this).children('td').get(1).innerText;
        var formula = $(this).children('td').get(2).innerText;
    });
}

function showTable(data) {
    if ( $.fn.dataTable.isDataTable( '#table-result' ) ) {
        $('#table-result').DataTable().destroy();
    }
    $('#table-result').DataTable(
        {
            data:data,
            columns: [
                { data: 'medicine_name', width: "25%" },
                { data: 'compoundlink', width: "40%"},
                { data: 'formula', width:"35%"},
            ],
            searching: true,
            ordering:  true,
            order: [[ 1, 'asc' ], [ 2, 'asc' ]],
            columnDefs: [
                { targets: 0, orderable: false },
                { targets: 1, orderable: true, orderData: [ 1, 2] },
                { type: "chinese-string", targets: [2] }  ],
            info: false,
            lengthChange: false,
            autoWidth: false,
            paging: data.length>10,
            language: {
                paginate: {
                    next: "下一页",
                    previous:"上一页"
                },
                sSearch: "搜索"
            }
        }
    );
    addHold($("#table-result tbody"));
}

$(document).ready(function () {
    search();
});