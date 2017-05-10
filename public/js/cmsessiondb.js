/**
* 	@SessionDB core module
*	@개발자 : mazdah (blog : http://mazdah.tistory.com, twitter : mazdah70, facebook : 우형준)
*	@Project : https://github.com/mazdah/SessionDB
*/

var SessionDB = function () {
	var StrorageDB;

	/**
	*	@ SessionDB 초기화 : sessionStorage를 사용할 것인지, localStorage를 사용할 것인지 설정
	*	@ parameter : tblType String ('session' 또는 'local')
	*	@ return : 
	*/
	var _init = function(tblType) {
		if ('session' == tblType) {
			StrorageDB = window.sessionStorage;
		} else {
			StrorageDB = window.localStorage;
		}
		
		if (StrorageDB.tableList == undefined || '' == StrorageDB.tableList) {
			StrorageDB.tableList = "[]";
		}
	};
	
	/**
	* 	@ 테이블 생성
	*	@ parameter : tblNm String (테이블 이름, 문자열)
	*	@ return : boolean
	*/
	var _createTable = function (tblNm) {

		if (tblNm == undefined || '' == tblNm) {
			alert('Table 이름은 필수입니다.');
			return false;
		}

		if (StrorageDB[tblNm] != undefined) {
			alert('이미 존재하는 테이블입니다.');
			return false;
		}

		// 세션 테이블 생성
		StrorageDB[tblNm] = '{"table": []}';

		// 테이블 목록에 테이블 이름 추가
		var tblArr = JSON.parse(StrorageDB.tableList);  //.push(tblNm);
		tblArr.push(tblNm);
		StrorageDB.tableList = JSON.stringify(tblArr);

		alert("테이블 생성에 성공하였습니다.\n\n" + tblNm + " = " + StrorageDB[tblNm]);
		return true;
	};
	
	/**
	* 	@ 테이블 목록 조회
	*	@ parameter : 
	*	@ return : 테이블 이름이 담긴 JSNON 배열 객체
	*/
	var _getTableList = function() {
		if (StrorageDB.tableList == undefined || StrorageDB.tableList == "") {
			return undefined;
		}

		var tableArr = JSON.parse(StrorageDB.tableList);

		if (tableArr.length == 0) {
			return undefined;
		}

		return tableArr;
	};
	
	/**
	* 	@ 테이블 Drop
	*	@ parameter : tblNm String (테이블 이름, 문자열)
	*	@ return : 
	*/
	var _dropTable = function (tblNm)  {
		if (StrorageDB[tblNm] == undefined) {
			return false;
		}
		
		if (confirm("테이블과 테이블 내의 모든 데이터가 지워집니다.\n계속하시겠습니까?")) {
			// 세션 테이블 삭제
			StrorageDB.removeItem(tblNm);

			// 테이블 목록에서 테이블 이름 삭제
			var tableArr = JSON.parse(StrorageDB.tableList);
			tableArr.splice(tableArr.indexOf(tblNm), 1);
			StrorageDB.tableList = JSON.stringify(tableArr);


			return true;
		}
	};

	/**
	* 	@ 테이블에 다수의 데이터 import
	*	@ parameter : tblNm String (테이블 이름, 문자열), dataArr JSON array (입력할 데이터 객체 배열), mode String (기존 데이터에 추가할 것인지 전체 테이블을 대체할 것인지에 대한 플래그)
	*	@ return : 
	*/
	var _importTable = function (tblNm, dataArr, mode) {
		if (mode == undefined || '' == mode) {
			mode = 'add';
		}

		var tableObj = JSON.parse(StrorageDB[tblNm]);

		if ('add' == mode) {
			var tableArr = tableObj.table;
			var rowCnt = tableArr.length;
			var rowId = 0;

			if (rowCnt > 0) {
				rowId = Number(tableArr[tableArr.length - 1]._id) + 1;

				var dataCnt = dataArr.length;
				for (i = 0; i < dataCnt; i++) {
					dataArr[i]._id = rowId;
					rowId++;
				}

				tableObj.table = tableObj.table.concat(dataArr);
			} else {
				tableObj.table = dataArr;
			}
		} else {
			tableObj.table = dataArr;
		}

		StrorageDB[tblNm] = JSON.stringify(tableObj);

		return dataArr.length;
	};
	
	/**
	* 	@ 테이블에 데이터 insert
	*	@ parameter : tblNm String (테이블 이름, 문자열), rowData String (JSON 포맷의 문자열)
	*	@ return : 0 - insert 실패, 1 - insert 성공
	*/
	var _insertRow = function(tblNm, rowData) {
		if (tblNm == undefined || '' == tblNm) {
			alert('Table 이름은 필수입니다.');
			return 0;
		}

		if (rowData == undefined || '' == rowData) {
			alert('insert할 데이터가 없습니다.');
			return 0;
		}

		if (StrorageDB[tblNm] == undefined) {
			if (confirm('테이블이 존재하지 않습니다. 테이블을 생성하여 진행하시겠습니까?')) {
				_createTable(tblNm);
			} else {
				return 0;
			}
		}

		var tableObj = JSON.parse(StrorageDB[tblNm]);
		var rowObj = JSON.parse(rowData);

		//alert("insertRow :: tableObj = " + JSON.stringify(tableObj));

		var tableArr = tableObj.table;
		var rowCnt = tableArr.length;
		//alert('tableArr = ' + JSON.stringify(tableArr) + ' : length = ' + rowCnt);

		var rowId = 0;
		if (rowCnt > 0) {
			rowId = Number(tableArr[tableArr.length - 1]._id) + 1;
		}

		rowObj._id = rowId + "";

		tableArr.push(rowObj);
		tableObj.table = tableArr;

		StrorageDB[tblNm] = JSON.stringify(tableObj);
		//alert("데이터를 정상적으로 insert 하였습니다.\n\ntableObj = " + JSON.stringify(tableObj));

		return 1;
	};

	/**
	* 	@ 테이블 가져오기
	*	@ parameter : tblNm String (테이블 이름, 문자열)
	*	@ return : String (테이블 정보가 담긴 JSON 포맷 문자열)
	*/
	var _getTable = function(tblNm) {
		if (tblNm == undefined || '' == tblNm || StrorageDB[tblNm] == undefined) {
			alert("존재하지 않는 테이블입니다.");
			return null;
		}
		return StrorageDB[tblNm];
	};

	/**
	* 	@ 데이터 select
	*	@ parameter : tblNm String (테이블 이름, 문자열), param JSON object (key:value 쌍의 기본적인 JSON 객체)
	*	@ return : Array object (param 조건에 맞는 데이터 객체의 배열)
	*/
	var _selectRow = function(tblNm, param) {
		if (tblNm == undefined || '' == tblNm) {
			alert('Table 이름은 필수입니다.');
			return;
		}

		if (param == undefined) {
			alert("조건이 정확하지 않습니다.");
			return;
		}

		var tableObj = JSON.parse(StrorageDB[tblNm]);
		var tableArr = tableObj.table;
		var rowCnt = tableArr.length;
		var cnt = 0;
		var resultArr = [];

	//	for (var obj in tableArr) {		//이렇게 하면 obj에 id만 들어감!!!
		for (i = 0; i < rowCnt; i++) {
			var obj = tableArr[i]

			var isEqual = true;
			for(key in param) {
				if (obj[key] == param[key]) {
					isEqual = isEqual && true;
				} else {
					isEqual = isEqual && false;
				}

				if (!isEqual) {
					continue;
				}
			}

			if (isEqual) {
				cnt++;
				resultArr.push(obj);
			}
		};

		if (cnt == 0) {
			//alert("조회 조건에 맞는 데이터가 없습니다.");
			return null;
		} else {
			//alert("총 " + cnt + "건의 데이터가 조회되었습니다.\n" + JSON.stringify(resultArr));
			return resultArr;
		}
	};

	/**
	* 	@ 데이터 delete
	*	@ parameter : tblNm String (테이블 이름, 문자열), col String (삭제할 조건이 되는 key), val String (삭제할 조건이 되는 값)
	*	@ return : number (실패 : 0, 성공 : 삭제된 데이터 건수)
	*/
	var _deleteRow = function(tblNm, col, val) {
		if (tblNm == undefined || '' == tblNm || val == undefined || '' == val || col == undefined || '' == col) {
			alert('Table 이름과 컬럼 이름과 컬럼 값은 필수입니다.');
			return 0;
		}

		var tableObj = JSON.parse(StrorageDB[tblNm]);
		var tableArr = tableObj.table;
		var rowCnt = tableArr.length;
		var cnt = 0;
		var resultArr = [];

	//	for (var obj in tableArr) {		//이렇게 하면 obj에 id만 들어감!!!
		for (i = 0; i < rowCnt; i++) {
			var obj = tableArr[i];

			//alert('i = ' + i + ' : col = ' + col + ' : obj = ' + JSON.stringify(obj));

			if (obj[col] == val) {
				tableArr.splice(i, 1);
				rowCnt--;
				cnt++;
				resultArr.push(obj);
			}
		};

		tableObj.table = tableArr;
		StrorageDB[tblNm] = JSON.stringify(tableObj);

		if (cnt == 0) {
			alert("삭제 조건에 맞는 데이터가 없습니다.");
			return 0;
		} else {
			alert("총 " + cnt + "건의 데이터가 삭제되었습니다.\n" + JSON.stringify(resultArr) + "\n\n" + StrorageDB[tblNm]);
			return resultArr.length;
		}
	}

	/**
	* 	@ 데이터 update
	*	@ parameter : tblNm String (테이블 이름, 문자열), col String (업데이트할 조건이 되는 key), val String (업데이트할 조건이 되는 값), param JSON object(업데이트할 데이터)
	*	@ return : number (실패 : 0, 성공 : 삭제된 데이터 건수)
	*/
	var _updateRow = function(tblNm, col, val, param) {
		if (tblNm == undefined || '' == tblNm || val == undefined || '' == val || col == undefined) {
			alert('Table 이름과 컬럼 이름과 컬럼 값은 필수입니다.');
			return 0;
		}

		if (param == undefined) {
			alert('수정할 값이 없습니다.');
			return 0;
		}

		var tableObj = JSON.parse(StrorageDB[tblNm]);
		var tableArr = tableObj.table;
		var rowCnt = tableArr.length;
		var cnt = 0;
		var resultArr = [];

	//	for (var obj in tableArr) {		//이렇게 하면 obj에 id만 들어감!!!
		for (i = 0; i < rowCnt; i++) {
			var obj = tableArr[i];

			//alert('i = ' + i + ' : col = ' + col + ' : obj = ' + JSON.stringify(obj));

			if (obj[col] == val) {
				for(key in param) {
					if (tableObj.table[i][key] == param[key]) {
						continue;
					} else {
						tableObj.table[i][key] = param[key];
					}

					
				}

				cnt++;
				resultArr.push(tableObj.table[i]);
			}
		};

		StrorageDB[tblNm] = JSON.stringify(tableObj);

		if (cnt == 0) {
			alert("Update 조건에 맞는 데이터가 없습니다.");
			return 0;
		} else {
			alert("총 " + cnt + "건의 데이터가 Update 되었습니다.\n" + JSON.stringify(resultArr) + "\n\n" + StrorageDB[tblNm]);
			return resultArr.length;
		}
	};

	return {
		init			: _init,
		createTable		: _createTable,
		getTableList	: _getTableList,
		dropTable		: _dropTable,
		importTable		: _importTable,
		insertRow		: _insertRow,
		getTable 		: _getTable,
		selectRow		: _selectRow,
		deleteRow		: _deleteRow,
		updateRow		: _updateRow
	}
}();
SessionDB.init('session');

/*
var cnt = 0;
var dbName = '';
var tblNm = '';
var row = '';

function createTable(tblNm) {
	if (tblNm != undefined && tblNm != '') {
		dbName = tblNm;
	} else {
		dbName = document.getElementById('dbNm').value;
	}
	

	if (dbName == undefined || '' == dbName) {
		alert('Table 이름은 필수입니다.');
		return;
	}

	if (StrorageDB[dbName] != undefined) {
		alert('이미 존재하는 테이블입니다.');
		return;
	}

	StrorageDB[dbName] = '{"table": []}';

	alert("테이블 생성에 성공하였습니다. :: " + StrorageDB[dbName]);
}

function insertRow() {
	tblNm = document.getElementById('tblNm').value;
	row = document.getElementById('row').value;

	if (tblNm == undefined || '' == tblNm) {
		alert('Table 이름은 필수입니다.');
		return;
	}

	if (row == undefined || '' == row) {
		alert('insert할 데이터가 없습니다.');
		return;
	}

	if (StrorageDB[tblNm] == undefined) {
		if (confirm('테이블이 존재하지 않습니다. 테이블을 생성하여 진행하시겠습니까?')) {
			createTable(tblNm);
		} else {
			return;
		}
	}

	var tableObj = JSON.parse(StrorageDB[tblNm]);
	var rowObj = JSON.parse(row);

	alert("insertRow :: tableObj = " + JSON.stringify(tableObj));

	var tableArr = tableObj.table;
	var rowCnt = tableArr.length;
	alert('tableArr = ' + JSON.stringify(tableArr) + ' : length = ' + rowCnt);

	var rowId = 0;
	if (rowCnt > 0) {
		rowId = Number(tableArr[tableArr.length - 1].id) + 1;
	}

	rowObj.id = rowId + "";

	tableArr.push(rowObj);
	tableObj.table = tableArr;

	StrorageDB[tblNm] = JSON.stringify(tableObj);
	alert("insertRow :: tableObj = " + JSON.stringify(tableObj));
}

function selectRow() {
	var col = document.getElementById('column').value;
	var val = document.getElementById('val').value;
	var tblNm2 = document.getElementById('tblNm2').value;

	if (tblNm2 == undefined || '' == tblNm2 || val == undefined || '' == val || col == undefined || '' == col) {
		alert('Table 이름과 컬럼 이름과 컬럼 값은 필수입니다.');
		return;
	}

	var tableObj = JSON.parse(StrorageDB[tblNm2]);
	var tableArr = tableObj.table;
	var rowCnt = tableArr.length;
	var cnt = 0;
	var resultArr = [];

//	for (var obj in tableArr) {		//이렇게 하면 obj에 id만 들어감!!!
	for (i = 0; i < rowCnt; i++) {
		var obj = tableArr[i]
		if (obj[col] == val) {
			cnt++;
			resultArr.push(obj);
		}
	};

	if (cnt == 0) {
		alert("조회 조건에 맞는 데이터가 없습니다.");
	} else {
		alert("총 " + cnt + "건의 데이터가 조회되었습니다.\n" + JSON.stringify(resultArr));
	}
}
*/