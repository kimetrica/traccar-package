var File = java.io.File;

function echo (s) {
    java.lang.System.out.println(s);
}
function readFile (f) {
    return String(com.sencha.util.FileUtil.readFile(f));
}

var commercialRe = /(This version of (Ext JS|Sencha Touch) is licensed commercially)|(Commercial Usage)|(Commercial Software License Agreement)/;
var gplRe = /(GPL)|(GNU General Public License Usage)/;

function getLicenseFromText (s) {
    var license = null;

    // The commercial license makes reference to GPL so we check for it
    // first then GPL:
    if (commercialRe.test(s)) {
        license = 'Commercial';
    }
    else if (gplRe.test(s)) {
        license = 'GPL';
    }

    return license;
}

function getLicenseFromFile (f) {
    if (!f.exists()) {
        return null;
    }
    return getLicenseFromText(readFile(f));
}

var touchVersionRe = /\"touch\"\,\"(2\.\d\.\d(?:\.\d+)?)\"/;
var touchWrongLicenseHeaderRe = /2\.0\.0$|2\.0\.1$/;

function getLicense (dir) {
    var touch = new File(dir, 'sencha-touch.js');
    var extjs = new File(dir, 'ext-all.js');
    var buildExtJS = new File(new File(dir, 'build'), 'ext-all.js');

    var framework = null,
        license = null;

    if (buildExtJS.exists()) {
        framework = 'ext';

        license = getLicenseFromFile(buildExtJS);
    }
    else if (extjs.exists()) {
        framework = 'ext';

        license = getLicenseFromFile(extjs);

        // Prior to 4.0.2, we must rely on the license file being present:
        if (!license) {
            license = getLicenseFromFile(new File(dir, 'license.txt'));
        }
    }
    else if (touch.exists()) {
        framework = 'touch';

        var text = readFile(touch);
        var match = touchVersionRe.exec(text);
        var version = match && match[1];
        //echo(dir + ': ' + version);

        // Version 2.0.1.1+ added the license to the file in the root, but prior to
        // that, the license header in sencha-touch.js for GPL was wrongly the
        // commercial license.

        if (touchWrongLicenseHeaderRe.test(version)) {
            //echo('Check license for ' + dir + ' (' + version + ')');

            license = getLicenseFromFile(new File(dir, 'license.txt'));
        } else if (version === '2.0.1.1') {
            //echo('Check multiple license ' + dir + ' (' + version + ')');

            // In 2.0.1.1 only, the commercial license text is present in both
            // GPL and Commercial sencha-touch.js files but they both *also* had the
            // proper license text prepended. Checking for the GPL first in this case
            // gets the correct answer.
            license = gplRe.test(text) ? 'GPL' : 'Commercial';
        } else {
            license = getLicenseFromText(text);
        }
    }

    return framework && {
        framework: framework,
        type: license || 'Missing'
    };
}
