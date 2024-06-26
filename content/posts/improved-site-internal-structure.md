---
title: "サイトの内部構造を改修しました"
date: 2024-03-23T15:08:34+09:00
draft: false
tldr: "見た目はほぼ変わりませんが、サイトの内部のつくりがきれいになりました。"
tags: ["技術"]
---

お久しぶりです。1年ぶり2回目の、翻訳以外の投稿となります。

昨年末からこのサイトの内側のつくりの改修に着手していたのですが、今月ようやく作業が完了しました。

見た目はほぼ全く変わらないはずですが、ページの配置や中身がごちゃごちゃしていた部分が解消し、管理しやすくなりました。

## 改修の理由
なぜわざわざ改修したかというと、以前のつくりでは、翻訳の手直しなどにかなり不要な手間がかかってしまっていたからです。

具体的には、たとえ小さな誤りを修正するだけでも、

* Markdown形式で書かれた、原語・翻訳の元ファイルを修正する
* 原語の元ファイルと翻訳の元ファイルをスクリプトで統合し、表示用に使う表形式に変換する
* 変換した結果を、サイトのページ用のファイルにコピー＆ペーストする
* サイトをビルドする

というステップを踏む必要がありました。スクリプトの実行もコピー＆ペーストも自動化しておらず、バージョン管理も甘かったので、大仕事とは言えないまでも、手直しを面倒に感じるくらいには面倒な手順です。このままでは、(他人事のようですが)サイト更新の意欲もどんどん落ちてしまいます。

こうした手順を踏んでいた背景には、一応は

* 翻訳ページに使う独自のHTML表形式への変換が必要だった
* サイトの生成に使っているHugoが、使いたいMarkdown記法の一部(ルビ)に対応していなかった

という理由があります。

しかし、改めて調べてみると、これらの課題は、別にスクリプト等々を使わなくても、もっと簡単に対処できるものでした。

以下では備忘録も兼ねて、今回これらの課題に対して取った対処法を記しておきたいと思います。

## 改修の内容
具体的な改修内容は下記の通りです。

### 翻訳の表にはHugoのShortcodeを使う
[Shortcode](https://gohugo.io/content-management/shortcodes/)は本サイトの作成に使っているHugoの機能のひとつで、よく使う/そのまま書くと見づらいHTMLコードをテンプレートに分離し、簡単な記法で呼び出せるようにしたものです。テンプレートはGo Templateが使えるので、大抵のことが可能です。

例えば、Hugoに標準搭載されている `figure` (図表) Shortcodeでは、画像URLや説明文を指定することで、図表のHTMLを埋め込むことができます。

翻訳ページで私がやりたかったことも、「翻訳の表の大枠は使いまわして、原文と訳文だけ渡せばサイト生成時にHTMLに整形されるようにしたい」ということですから、まさしくShortcodeが使える場面と言えます。(サイト解説当初はちゃんと調べておらず、使えると思っていませんでした)

そこで今回、スクリプトで作っていた表のHTMLをテンプレートに移し、もともとの「原文・訳文の元ファイル」の場所をShortcodeに渡せば、サイト生成時に原文・訳文の統合から表の作成まで一気にやってくれるようにしました。

複数ファイル対応やファイル読み込み処理の都合でけっこう処理がごちゃごちゃしていますが、ソースコードは[こちら](https://github.com/mi759/mi759.github.io/blob/main/layouts/shortcodes/translationTable.html)にあります。

これで、訳文の誤りが見つかった場合も、Markdown形式の元ファイルをそのまま修正して、サイトを生成しなおすだけでよくなりました。

さらに副作用として、元ファイルがGit(そしてGitHub)の管理下に入ったことで、翻訳の修正履歴を容易にたどれるようになりました。たどりたいケースがあるかどうかは微妙ですが。

### ルビのMarkdownは、goldmarkの拡張を作った
私は翻訳ではけっこうルビ(振り仮名)を使うのですが、訳文を書くのに使っているMarkdownは正式にはルビに対応していません。HTMLのルビタグ `<ruby>` を毎回書くか、ルビ対応のMarkdown方言を使用する必要があります。

私の場合は、記法の明快さから[でんでんマークダウン記法](https://conv.denshochan.com/markdown#ruby) `{漢字|かんじ}` を使うことにしました。

しかし、残念なことにHugoはでんでんマークダウンに対応していません。更に言えば、デフォルトのgoldmarkをはじめ、Hugoで利用できるMarkdownパーサーはいずれも対応していません。

そのため、使いたい場合はHugoやgoldmarkに手を加えるか、生成前にルビだけ自分でHTMLに変換しておく必要があります。今までの私のアプローチは後者でした。Hugoをいじるのは手間なので、やむを得ない判断ではあります。

しかしながら、変換が挟まったままでは改修の目的を果たせないので、今回は意を決してHugoとgoldmarkに独自に手を加えることにしました。具体的には、

1. でんでんマークダウンのルビ記法をサポートする、goldmarkのextension(拡張)を作る
2. Hugoでそのextensionを使えるようにする

という作業を行っています。でんでんマークダウンのパーサーはPHPで実装されたものがあるので、Hugoからそれを呼ぶ形式も試したのですが、GitHub ActionsのVM上での動作がどうしてもうまくいかなかったので諦めました。ローカルでは動いたのですが……。

#### goldmarkのextension(拡張)を作る
1.で作ったextensionは下記です。

https://github.com/mi759/goldmark-ruby

goldmarkは拡張性の高さを謳っていますが、拡張方法に関するドキュメントはあまり揃っていなさそうだったので、既存の拡張機能を見ながら見様見真似で作成しました。そのため適切な実装になっているかは不明ですが、ひとまず問題なく動いています。

goldmark-rubyを名乗るからには他のルビ記法(青空文庫ルビやpixiv小説ルビ)もいずれ対応したいところですが、青空文庫ルビは区切り文字省略の実装がかなり面倒そうなのもあり、もうでんでんマークダウン記法だけでいいんじゃないかな……と思う部分はあります。

#### Hugoでそのextensionを使えるようにする
1.で作ったextensionを呼ぶ処理をHugoのgoldmarkの設定部分に追記して、リリースを作成しました。HugoはHugoreleaserという独自のリリース自動化ツールを使用しているので、ローカルにそれを入れるだけで手軽に各環境向けのビルドが作成できます。おかげで、GitHub Actionsで使うdebパッケージも簡単に用意できました。

## 今後やりたいこと
とりあえず今回の改修は以上ですが、作業の過程で見えた今後の課題もいくつかあります。

* goldmark-rubyの機能充実(他のルビ記法への対応、rpタグ対応)
* Hugo上でリンクプレビュー(リンクカード)を出せるようにする
* そもそもちゃんと新しい翻訳を出す

特に翻訳については、訳は紙面でできているがデータ化をさぼっている、というのがかなり溜まってきたので、そろそろどうにかしたいと思います。

では、またお会いしましょう。


