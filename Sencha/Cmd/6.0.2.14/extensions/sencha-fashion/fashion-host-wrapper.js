// @require fashion/fashion-min.js

importPackage(com.sencha.util);

Fashion.Env.readFileRhino = function(file) {
    return FileUtil.readUnicodeFile(file) + '';
};

Fashion.Env.loadFileRhino = function(file, success, error) {
    try {
        success(Fashion.Env.readFile(file));
    } catch (err) {
        if(error) {
            error(err);
        }
    }
};

Fashion.mainbuilder = Fashion.mainbuilder || new Fashion.Builder({
    context: {
        libraries: {
            compass: compassPath,
            blueprint: blueprintPath
        }
    }
});

function fashionBuild(inputFile) {
    var builder = Fashion.mainbuilder,
        syntax, sassFile;

    sassFile = builder.getSassFile(inputFile);
    sassFile.invalidate();
    sassFile.onReady(function(){
        syntax = sassFile.getExpandedAst();
    });

    return fashionConvert(syntax);
};

function fashionTokenize(sass) {
    return new Fashion.parse.Tokenizer().tokenize(sass);
}

function fashionParse(sass) {
    var parser = new Fashion.parse.Parser();
    return parser.parse(sass);
}

function fashionConvert(syntax) {
    return Fashion.mainbuilder.context.convert(syntax);
}

function fashionRun(js) {
    return Fashion.mainbuilder.context.run(js);
}

function fashionGetCss(js) {
    var future = new ThreadUtil.SettableFuture();
    fashionRun(js).getText(function(generated){
        future.set(generated.join(''));
    });
    return future.get() + '';
}

function fashionCompile(syntax) {
    return fashionRun(fashionConvert(syntax));
}

function fashionCompileCss(sass) {
    return fashionCompile(fashionParse(fashionTokenize(sass))).getText();
}

function jsonEncode(obj) {
    return JSON.stringify(obj, ignoreLineNumber, 4);
}

function fashionFullCompile(path) {
    Fashion.Env.allowAsyncLoad = false;
    var converted = fashionBuild(path),
        future = new ThreadUtil.SettableFuture();

    var func = Fashion.mainbuilder.context.runtime.compile(converted),
        css = func();

    css.getText(function(generated){
        future.set(generated.join(''));
    });
    return future.get() + '';
}