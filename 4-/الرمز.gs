function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Graduation Check-in')
      .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/190/190411.png')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function checkAttendance(barcode) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) { // start from row 2
    if (data[i][0] == barcode) { // column A = Barcode
      if (data[i][2] == "Checked-in") {
        return { status: "used", message: "❌ هذا الرقم تم استخدامه مسبقاً" };
      } else {
        // Update status and timestamp
        sheet.getRange(i+1, 3).setValue("Checked-in"); // column C
        sheet.getRange(i+1, 4).setValue(new Date());    // column D
        return { status: "success", message: "🎓 مرحباً بك في حفل التخرج! نتمنى لك يوماً لا يُنسى" };
      }
    }
  }
  return { status: "notfound", message: "⚠️ الرقم غير موجود في القائمة. يرجى مراجعة المنظمين" };
}