# Introduction

...

# Getting Started

``` shell
git clone xxx

git add .
git commit -m "first commit"
git branch -M main
git push -u origin main
```

`github` -> `Settings` -> `Pages` からドキュメントソースとなるブランチとルートディレクトリを指定する

- branch: gh-pages
- dir: /

# 基本用語

- kvm: linux用の仮想化システム（ハイパーバイザ）
- qemu: KVMやXenなどと組み合わせて使う仮想マシンエミュレータ
- virt: 仮想マシンなどを管理操作するツール
- k8s（クバネティス）: コンテナオーケストレータ
- openshift: Red Hatが開発するk8sのエンタープライズ向け
- kubevirt: k8s上で仮想マシンをコンテナのように取り扱い統合するツール

# 目標

WSL上で次のツールを使えるようにすることを目標とする。

- [ ] kvm
- [ ] qemu
- [ ] multipass
- [ ] k8s（クバネティス）
- [ ] kubevirt


# kvm/qemuはWSL上で使えるか？

使えるようだ。（Nested VM）

https://blog.bobuhiro11.net/2020/11-04-kvm-on-wsl2.html
https://hiro20180901.hatenablog.com/entry/2022/02/26/160000#WSL2-%E3%81%A7-Nested-VM-%E3%81%8C%E6%9C%89%E5%8A%B9%E3%81%8B%E3%81%A9%E3%81%86%E3%81%8B%E7%A2%BA%E8%AA%8D

