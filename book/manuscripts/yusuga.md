---
class: content
---

<div class="doc-header">
  <h1>[OrbStack 対応版] グローバル環境を可能な限り汚染せずに Markdown から組版の PDF を生成</h1>
  <div class="doc-author">菅原 祐</div>
</div>

[OrbStack 対応版] グローバル環境を可能な限り汚染せずに Markdown から組版の PDF を生成
==

<img alt="Zenn 記事への QR コード" style="float:right;margin-left:6px" width=80  src="./images_yusuga/zenn.png">

本記事は Zenn でも読むことができます。加筆や修正などがある場合は Zenn の記事で対応します。

https://zenn.dev/yusuga/articles/949adb38047610

## はじめに

<img alt="ゆめみ大技林 '23" style="float:right;margin-left:6px" width=80  src="./images_yusuga/tbf15.png">

本稿は[ゆめみ大技林 '23](https://zenn.dev/yumemi_inc/articles/afe7745cd62af2) の続きになります。組版の PDF を生成するためには <!-- textlint-disable -->Vivliostyle<!-- textlint-enable --> というツールを使用していますが、詳細に関しては[ゆめみ大技林 '23](https://zenn.dev/yumemi_inc/articles/afe7745cd62af2) をご覧ください。

## Docker を OrbStack で動かす

最近ゆめみでは Docker のローカルマシン上ので実行が Docker Desktop から OrbStack を推奨するように変わりました。[ゆめみ大技林 '23](https://zenn.dev/yumemi_inc/articles/afe7745cd62af2) では Docker Desktop の代わりに colima を使用していたので影響はないのですが、せっかくなので OrbStack を代わりに使えるのかを試してみました。

<!-- textlint-disable -->
## 動作確認環境
<!-- textlint-enable -->

- OS: macOS Sonoma 14.1.2（23B92）
- CPU: Apple M2 Pro
- Docker Desktop 4.29.0（145265）
- OrbStack 1.5.1（16857）

## OrbStack とは

<img alt="orbstack.dev" style="float:right;margin-left:6px" width=80  src="./images_yusuga/orbstack.png">

<!-- textlint-disable -->
[OrbStack](https://orbstack.dev) は、Docker コンテナと Linux マシンを macOS 上で簡単に、軽快に、そして高速に動作させるためのソフトウェアです。このソフトウェアは、Docker Desktop や Windows Subsystem for Linux（WSL）の代替として開発され、使用するリソースは少なく、セットアップが簡単でパフォーマンスに優れています。また、Apple Silicon を使用しているユーザーにとっても最適化されており、インテル CPU 用のイメージを Rosetta を通じて効率的に実行できます by ChatGPT。
<!-- textlint-enable -->

OrbStack の料金は 2024 年 4 月時点では Docker Desktop と同様に個人利用は無料ですが、商用利用は有料となるのでご注意ください。

## OrbStack をインストール

brew でインストールします。公式サイトからダウンロードも可能です。

```sh
$ brew install orbstack
```

## OrbStack を起動

インストールした `OrbStack.app` を起動します。
<!-- textlint-disable -->
起動後に `$ docker version` を実行すると Client の Context が `orbstack` に変わり、Server も `Docker Engine - Community` に変わっていることが確認できます。
<!-- textlint-enable -->

```sh
$ docker version
Client:
 Version:           25.0.5
 API version:       1.44
 Go version:        go1.21.8
 Git commit:        5dc9bcc
 Built:             Tue Mar 19 15:02:31 2024
 OS/Arch:           darwin/arm64
 Context:           orbstack

Server: Docker Engine - Community
 Engine:
  Version:          25.0.5
  API version:      1.44 (minimum version 1.24)
  Go version:       go1.21.8
  Git commit:       e63daec
  Built:            Tue Mar 19 15:05:27 2024
  OS/Arch:          linux/arm64
  Experimental:     false
 containerd:
  Version:          v1.7.13
  GitCommit:        7c3aca7a610df76212171d200ca3811ff6096eb8
 runc:
  Version:          1.1.12
  GitCommit:        51d5e94601ceffbbd85688df1c928ecccbfa4685
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

`OrbStack.app` を起動する代わりに、コマンドラインでも各種操作は可能です。

**OrbStack の開始**

```sh
$ orbctl start
```

**OrbStack のステータスを確認**

```sh
$ orbctl status
Running
```

**OrbStack の停止**

```sh
$ orbctl stop
```

<hr class="page-break"/>

## colima を OrbStack に変更

[ゆめみ大技林 '23](https://zenn.dev/yumemi_inc/articles/afe7745cd62af2) で紹介していた [Makefile](https://github.com/yusuga/markdown-to-typesetting-pdf/blob/main/Makefile) の `$ colima start` を `$ orbctl start` に変更します。

```diff
git diff Makefile
diff --git a/Makefile b/Makefile
index 5777a22..ce3acef 100644
--- a/Makefile
+++ b/Makefile
@@ -123,10 +123,10 @@ install_colima:
                brew install colima; \
        fi

-.PHONY: start_colima
-start_colima:
-       @if [ $$(colima status 2>&1 | grep -c "not running") -eq 1 ]; then \
-               colima start; \
+.PHONY: start_orbstack
+start_orbstack:
+       @if [ $$(orbctl status 2>&1 | grep -c "Stopped") -eq 1 ]; then \
+               orbctl start; \
        fi

 .PHONY: prepare_docker
@@ -135,4 +135,4 @@ prepare_docker: \
        install_docker \
        install_docker-compose \
        install_colima \
-       start_colima
+       start_orbstack
```

## PDF の生成

`$ make run` を行うと OrbStack 上で Docker が動き、colima と変わらず PDF が生成できることを確認できます。

## あとがき

<!-- textlint-disable -->
思ったよりもつまずくところなく colima を OrbStack に差し替えることができて拍子抜けしました。OrbStack は Docker Desktop と同様に商用利用は有料なため金額的な話では colima の方が利用しやすいですが、選択肢が増えるのはいいことです。引き続きいろいろな方法を試して行こうと思います。
<!-- textlint-enable -->

<hr class="page-break"/>
　