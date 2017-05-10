var currTable;
var currKeyArr;
var currMode;
var currId;
var prevTableObj;

$('document').ready(function () {

	$('#_btn-go-create-table').click(function () {
		//alert('table create button clicked');
		$('._wrapper1').hide();
		$('._wrapper2').show();
		$('._wrapper3').hide();
	});

	$('#_tblType').on('change', function () {
		SessionDB.init($('#_tblType').val());
		view.init();
	});

	$('#_dashboard').click(function () {
		$('._tables').removeClass('active');
		$('._dashboard').addClass('active');

		view.setDashBoard();
		//alert('table create button clicked');
		$('._wrapper1').show();
		$('._wrapper2').hide();
		$('._wrapper3').hide();
	});

	$('#_tables').click(function () {
		$('._tables').addClass('active');
		$('._dashboard').removeClass('active');
		//alert('table create button clicked');
	});

	$('#_btn-create-table').click(function() {
		var tblNm = $('#_tblNm').val();

		if (SessionDB.createTable(tblNm)) {
			view.init();
		}
	});

	$('#_btn-go-row-insert').click(function() {
		$('._insert-cols').empty();

		var appendStr = '';
		var cnt = currKeyArr.length;

		if (cnt == 0) {
			appendStr += '<textarea class="form-control" id="_row-data" rows="3"></textarea>';
		} else {
			for (i = 0; i < cnt; i++) {
				if ('_id' == currKeyArr[i]) {
					continue;
				}
				appendStr += '<div class="form-group"><label for="_ins-' + currKeyArr[i] + '">'+ currKeyArr[i] + ' </label><input type="text" class="form-control" id="_ins-' + currKeyArr[i] + '" placeholder="' + currKeyArr[i] + '"></div>';
			}
		}

		$('._insert-cols').append(appendStr);
		$('#_btn-row-insert').text('Insert Row');
		$('.modal-title').text('Insert Row');
		currMode = 'I';
	});

	$('._btn-row-insert').on('click', function() {
		if ('I' == currMode) {
			controller.insertRow();
		} else {
			controller.updateRow();
		}
		
	});

	$('#_btn-tbl-drop').click(function() {
		if (confirm("테이블을 Drop하면 테이블 내의 모든 데이터도 함께 삭제됩니다.\n계속하시겠습니까?")) {
			SessionDB.dropTable(currTable);
			view.init();
			$('._wrapper1').show();
			$('._wrapper2').hide();
			$('._wrapper3').hide();
		}
	});

	$('#_btn-tbl-export').click(function() {
		var tableObj = JSON.parse(SessionDB.getTable(currTable));
		tableObj.tableName = currTable;

		$('#_query-area').val(JSON.stringify(tableObj, null, 4));
	});

	$('#_btn-tbl-import').click(function() {
		var importData = $('#_query-area').val();
		if (importData == '') {
			alert("Import할 데이터가 없습니다.");
			return;
		}

		var objForImport = JSON.parse(importData);
		var mode = $('#_mode-group input:radio:checked').val();

		var result = SessionDB.importTable(objForImport.tableName, objForImport.table, mode);

		if (result > 0) {
			view.setTableData(SessionDB.getTable(currTable));
			alert(result + "건의 데이터를 정상적으로 import 하였습니다.");
		}
	});

	$('#_btn-go-import-data').click(function() {
		window.location.href = $('#_move-url').val();
	});

	view.setDashBoard();
});

var view = function() {
	var tblArr;

	var _init = function() {
		tblArr = SessionDB.getTableList();

		$('._wrapper1').show();
		$('._wrapper2').hide();
		$('._wrapper3').hide();

		if (tblArr == undefined) {
			alert("생성된 테이블이 없습니다.");
			$('._tbl-list').empty();
			return;
		}

		var cnt = tblArr.length;

		$('._cnt-main-tbl').empty();
		$('._cnt-main-tbl').text(cnt);

		if ('session' == $('#_tblType').val()) {
			$('._cnt-main-tbl').removeClass('label-warning');
			$('._cnt-main-tbl').addClass('label-success');
		} else {
			$('._cnt-main-tbl').addClass('label-warning');
			$('._cnt-main-tbl').removeClass('label-success');
		}

		var appendStr = '';
		$('._tbl-list').empty();
		for (i = 0; i < cnt; i++) {
			appendStr += '<li><a class="_lnk-tbl ' + tblArr[i] + '" href="javascript:view.goTablePage(\''+ tblArr[i] +'\')""><i class="fa fa-circle-o"></i> ' + tblArr[i] + '</a></li>';
		}

		$('._tbl-list').append(appendStr);
	};

	var _setDashBoard = function () {
		var sStorageArr = JSON.parse(window.sessionStorage.tableList);
		var lStorageArr = JSON.parse(window.localStorage.tableList);

		var lCnt = lStorageArr.length;
		var sCnt = sStorageArr.length;
		$('._cnt-local-table').text(lCnt);
		$('._cnt-session-table').text(sCnt);

		/*
		<li class="list-group-item">
                <span class="badge">14</span>
                Cras justo odio
              </li>
        */

        $('._group-session-table').empty();
        $('._group-local-table').empty();
        var appendStr = "";

        if (lCnt == 0) {
        	appendStr = '<li class="list-group-item">' +
                			'생성된 테이블이 없습니다.' +
             				'</li>';
            $('._group-local-table').append(appendStr);
        } else {
        	for (i = 0; i < lCnt; i++) {
        		var tableStr = window.localStorage[lStorageArr[i]];
        		var tableArr = JSON.parse(tableStr);

        		appendStr += '<li class="list-group-item">' +
                				'<span class="badge">'+ tableArr.table.length + '</span>' +
                				lStorageArr[i] +
             					'</li>';
        	}

        	$('._group-local-table').append(appendStr);
        }


        appendStr = "";
        if (sCnt == 0) {
        	appendStr = '<li class="list-group-item">' +
                			'생성된 테이블이 없습니다.' +
             				'</li>';
            $('._group-session-table').append(appendStr);
        } else {
        	for (i = 0; i < sCnt; i++) {
        		var tableStr = window.sessionStorage[sStorageArr[i]];
        		var tableArr = JSON.parse(tableStr);

        		appendStr += '<li class="list-group-item">' +
                				'<span class="badge">'+ tableArr.table.length + '</span>' +
                				sStorageArr[i] +
             					'</li>';
        	}
        	$('._group-session-table').append(appendStr);
        }

	};

	var _goTablePage = function(tblNm) {

		if (prevTableObj) {
			prevTableObj.removeClass('active');
		}

		prevTableObj = $('.' + tblNm).parent();
		$('.' + tblNm).parent().addClass('active');

		var table = SessionDB.getTable(tblNm);
		currTable = tblNm;

		$('._wrapper1').hide();
		$('._wrapper2').hide();
		$('._wrapper3').show();

		$('._lbl-tblNm').empty();
		$('._lbl-tblNm').text(tblNm);

		_setTableData(table);
	};

	var _setTableData = function(tbl) {
		var table = tbl;
		var tableObj = JSON.parse(table);
		var rows = tableObj.table;

		var cnt = rows.length;
		$('._tbl-body').empty();
		if (cnt == 0) {
			$('._tbl-head').empty();
			$('._tbl-body').append('<tr><td align="center">데이터가 없습니다.</td></tr>');
			currKeyArr = [];
		} else {
			var keyArr = [];
			var keyCnt = 0;
			for (i = 0; i < cnt; i++) {
				rowObj = rows[i];

				if (i == 0) {
					var header = '<tr>';
					for (key in rowObj) {
						keyArr.push(key);
						header += '<th class="info">' + key + '</th>'
					}
					currKeyArr = keyArr;
					keyCnt = keyArr.length;
					header += '<th class="info">데이터 조작</th>'
					header += '</tr>'

					$('._tbl-head').empty();
					$('._tbl-head').append(header);
				}

				var body = '<tr>';
				for (j = 0; j < keyCnt; j++) {
					body += '<td>' + rowObj[keyArr[j]] + '</td>'
				}
				body += '<td><button class="btn _btn-row-del btn-danger" onClick="javascript:controller.deleteRow(\'' + rowObj._id + '\')">삭제</button> <button class="btn _btn-row-up btn-warning" onClick="javascript:controller.openUpdatePopup(\'' + rowObj._id + '\')"  data-toggle="modal" data-target="#_modal-row-insert">수정</button></td>'
				body += '</tr>'

				$('._tbl-body').append(body);

			}
		}
	}

	return {
		init			: _init,
		setDashBoard	: _setDashBoard,
		goTablePage		: _goTablePage,
		setTableData	: _setTableData
	}
}();
view.init();

var controller = function() {
	var _init = function() {

	};

	var _insertRow = function() {
		var rowData = {};
		var rowDataStr;

		var cnt = currKeyArr.length;

		if (cnt == 0) {
			rowDataStr = $('#_row-data').val();
		} else {
			for (i = 0; i < cnt; i++) {
				if ('_id' == currKeyArr[i]) {
					continue;
				}
				
				rowData[currKeyArr[i]] = $('#_ins-' + currKeyArr[i]).val();
			}

			rowDataStr = JSON.stringify(rowData);
		}
		

		var result = SessionDB.insertRow(currTable, rowDataStr);

		if (result > 0) {
			alert("데이터를 성공적으로 insert 하였습니다.");
			view.setTableData(SessionDB.getTable(currTable));
			$('#_close-modal').trigger('click');
		} else {
			alert("데이터 insert에 실패하였습니다. 잠시 후 다시 시도해보세요.");
		}

		currMode = "";
	};

	var _deleteRow = function(id) {
		var result = 0;

		if (confirm("데이터를 정말 삭제하시겠습니까?")) {
			result = SessionDB.deleteRow(currTable, '_id', id);
		} else {
			return;
		}

		if (result > 0) {
			view.setTableData(SessionDB.getTable(currTable));
			alert("데이터를 정상적으로 삭제하였습니다.");
		}
	};

	var _openUpdatePopup = function(id) {
		var param = {};
		param._id = id;

		var targetRow = SessionDB.selectRow(currTable, param);

		var cnt = currKeyArr.length;
		var appendStr = "";

		$('._insert-cols').empty();
		for (i = 0; i < cnt; i++) {
			if ('_id' == currKeyArr[i]) {
				continue;
			}
			appendStr += '<div class="form-group"><label for="_up-' + currKeyArr[i] + '">'+ currKeyArr[i] + ' </label><input type="text" class="form-control" id="_up-' + currKeyArr[i] + '" placeholder="' + currKeyArr[i] + '" value="' + targetRow[0][currKeyArr[i]] + '"></div>';
		}
		$('._insert-cols').append(appendStr);

		$('#_btn-row-insert').text('Update Row');
		$('.modal-title').text('Update Row');
		currMode = 'U';
		currId = id;
	};

	var _updateRow = function() {
		var param = {};
		var rowDataStr;
		var result = 0;

		var cnt = currKeyArr.length;

		for (i = 0; i < cnt; i++) {
			if ('_id' == currKeyArr[i]) {
				continue;
			}
			
			param[currKeyArr[i]] = $('#_up-' + currKeyArr[i]).val();
		}

		result = SessionDB.updateRow(currTable, '_id', currId, param);

		if (result > 0) {
			alert("데이터를 성공적으로 Update 하였습니다.");
			view.setTableData(SessionDB.getTable(currTable));
			$('#_close-modal').trigger('click');
		} else {
			alert("데이터 Update에 실패하였습니다. 잠시 후 다시 시도해보세요.");
		}

		currMode = "";
	}

	return {
		init			: _init,
		insertRow		: _insertRow,
		deleteRow		: _deleteRow,
		openUpdatePopup	: _openUpdatePopup,
		updateRow		: _updateRow
	}
}();
controller.init();