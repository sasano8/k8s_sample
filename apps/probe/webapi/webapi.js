const express = require("express")
const app = express()
var start = Date.now()

app.get("/ready", function(request, response) {
    /*
    RidinessProbe: 起動確認
    
    起動から20秒以内は500を返す（疑似的な初期化期間）
    それ以降は200を返す

    Ridinessは、アプリケーションが依存しているサービスを含めた検証を実装すべき
    */
    var msec = Date.now() - start
    var code = undefined
    if (msec <= 20000) {
        code = 500
    } else {
        code = 200
    }

    console.log("GET /ready " + code)
    response.status(code).send("OK")
})

app.get("/healthz", function(request, response) {
    /*
    Livenessプロープハンドラー: 生存確認

    起動から40秒以内は200を返す
    それ以降は500を返す

    Livenessは、アプリケーション単体の検証を実装すべき
        - 基本的には単に200を返せばよいと思う
        - せいぜいデータベースと疎通できるか程度の最低限の依存関係を検証すればよい
    */
    var msec = Date.now() - start
    var code = 200
    if (msec <= 40000) {
        code = 200
    } else {
        code = 500
    }

    console.log("GET /healthz " + code)
    response.status(code).send("OK")
})

app.get("/", function(request, response) {
    console.log("GET /")
    response.send("Hello from Node.js")
})

app.listen(3000)
