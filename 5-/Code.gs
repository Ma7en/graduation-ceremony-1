function doGet() {
    return HtmlService.createHtmlOutputFromFile("index")
        .setTitle("Graduation Check-in")
        .setFaviconUrl("https://cdn-icons-png.flaticon.com/512/190/190411.png")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function checkAttendance(barcode) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
        // start from row 2
        if (data[i][0] == barcode) {
            // column A = Barcode

            // التحقق من وجود ديون (العمود C - HasDebt)
            var hasDebt = data[i][2];
            var isDebtor =
                hasDebt == "نعم" ||
                hasDebt == "YES" ||
                hasDebt == "yes" ||
                hasDebt == "Yes" ||
                hasDebt == "نعم";

            // التحقق من الحضور السابق (العمود D - Status)
            var alreadyChecked = data[i][3] == "Checked-in";

            // تسجيل الحضور دائماً (سواء عليه فلوس أو لأ)
            if (!alreadyChecked) {
                sheet.getRange(i + 1, 4).setValue("Checked-in"); // column D
                sheet.getRange(i + 1, 5).setValue(new Date()); // column E
            }

            // تحديد الرسالة حسب الحالة
            if (alreadyChecked) {
                return {
                    status: "used",
                    message: "❌ هذا الرقم تم استخدامه مسبقاً",
                    alreadyChecked: true,
                };
            } else if (isDebtor) {
                return {
                    status: "debt_success",
                    message:
                        "🎓 مرحباً بك في حفل التخرج! ✅ تم تسجيل حضورك\n\n⚠️ تنبيه: توجد مستحقات مالية عليك، يرجى مراجعة الحسابات بعد الحفل.",
                    hasDebt: true,
                };
            } else {
                return {
                    status: "success",
                    message: "🎓 مرحباً بك في حفل التخرج! تم تسجيل حضورك بنجاح",
                    hasDebt: false,
                };
            }
        }
    }
    return {
        status: "notfound",
        message: "⚠️ الرقم غير موجود في القائمة. يرجى مراجعة المنظمين",
    };
}
