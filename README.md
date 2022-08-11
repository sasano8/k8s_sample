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
- kubevirt: k8s上で仮想マシンをコンテナのように取り扱い統合するツール
- openshift: Red Hatが開発するk8sのエンタープライズ向け
- OKD: openshiftの無償版？
- cri-o: Kubernetesに最適化され、Kubernetesでのみ動作するコンテナ

# 目標

WSL上で次のツールを使えるようにすることを目標とする。

- [ ] kvm
- [ ] qemu
- [ ] multipass
- [ ] k8s（クバネティス）
    - Minikube: シングルノード構成（マスター・ノード兼任）でローカルや学習環境向け
    - kubeadm
    - k3s
    - kind
    - microk8s
    - Google Kubernetes Engine (GKE)
    - Amazon Elastic Kubernetes Service (EKS)
    - Azure Kubernetes Service (AKS)
- [ ] kubevirt

k8sのディストリビューション毎の違いは次を参照

- https://thechief.io/c/editorial/k3d-vs-k3s-vs-kind-vs-microk8s-vs-minikube/

ディストリビューションとは、どの環境にどのように実装するかという実装そのものと捉えればよい。


# ディストリビューションの削除

``` cmd
wsl --list -v
wsl --shutdown
wsl --unregisterd Ubuntu-22.04
```


# kvm/qemuはWSL上で使えるか？

Windows 11から使えるようだ。（Nested VM）

https://blog.bobuhiro11.net/2020/11-04-kvm-on-wsl2.html
https://hiro20180901.hatenablog.com/entry/2022/02/26/160000#WSL2-%E3%81%A7-Nested-VM-%E3%81%8C%E6%9C%89%E5%8A%B9%E3%81%8B%E3%81%A9%E3%81%86%E3%81%8B%E7%A2%BA%E8%AA%8D


次のコマンドを実行し、システムがKVM仮想化をサポートしているかどうかを確認する。

``` shell
sudo apt install cpu-checker
sudo kvm-ok

# INFO: /dev/kvm exists
# KVM acceleration can be used
```

次のコマンドを実行し、0以上であることを確認（0以上で仮想化対応）。

``` shell
egrep -c '(vmx|svm)' /proc/cpuinfo
```

# snapのインストール

`multipass`は`snap`でインストールする必要がある。
`snapd`は`systemd`に依存するが、`wsl2`は`systemd`がデフォルトでは動いていない。

```
sudo /usr/libexec/wsl-systemd
```
https://arkane-systems.github.io/wsl-transdebian/
```
https://arkane-systems.github.io/wsl-transdebian/
```
/etc/genie.ini
genie -s

上を.bashrcなどに追記しておけばsnapdが開始される


``` shell
sudo snap install multipass
```

# dockerのインストール

```
sudo snap install docker
sudo update-alternatives --config iptables
# 1: /usr/sbin/iptables-legacy を選択

sudo groupadd docker
sudo usermod -aG docker $USER && newgrp docker
sudo chgrp docker /var/run/docker.sock

docker run hello-world
```

# Kubectl

```
https://kubernetes.io/ja/docs/tasks/tools/install-kubectl/

snap install kubectl --classic
kubectl version --client
```

# Minikube

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

alias kubectl='minikube kubectl --'
minikube start

kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
```

WSL2と相性が悪いっぽい！？
VM上にシングルノードk8s環境を構築し、そのためにmultipassを使ってるっぽい

# MicroK8s

https://ubuntu.com/blog/kubernetes-on-windows-with-microk8s-and-wsl-2


```
sudo snap install microk8s --classic
microk8s status

sudo usermod -aG microk8s $USERmico
```

新しくシェルを開き直す

```
microk8s status
microk8s kubectl get all --all-namespaces
```

```
microk8s enable dns dashboard

# If RBAC is not enabled access the dashboard by creating a default token with:
microk8s kubectl create token -n kube-system default --duration=8544h

microk8s kubectl get services -A
```

```
microk8s kubectl -n kube-system port-forward --address 0.0.0.0 service/kubernetes-dashboard 8080:443
# virtctlを使う時、localhost:8080にアクセスするので8080がいいと思う
```

https://localhost:5000/


# Kubevirt

kubevirtはmicrok8sで動かないっぽい！？

ハードウェア仮想化サポートの検証する。

```
sudo apt install cpu-checker
sudo apt install libvirt-clients
kvm-ok
virt-host-validate qemu
```

https://kubevirt.io/user-guide/operations/installation/
export RELEASE=$(curl https://storage.googleapis.com/kubevirt-prow/release/kubevirt/kubevirt/stable.txt)

microk8s kubectl apply -f https://github.com/kubevirt/kubevirt/releases/download/${RELEASE}/kubevirt-operator.yaml
microk8s kubectl apply -f https://github.com/kubevirt/kubevirt/releases/download/${RELEASE}/kubevirt-cr.yaml

# 起動まで少々時間がかかる
microk8s kubectl -n kubevirt wait kv kubevirt --for condition=Available

microk8s kubectl get pods -n kubevirt


仮想マシンをデプロイする。

```
microk8s kubectl apply -f https://raw.githubusercontent.com/kubevirt/kubevirt.github.io/master/labs/manifests/vm.yaml
```

VMを起動しようとするところまで確認できたが、失敗している。
とりあえず、ここまでで妥協。理解が深まったら不具合対応を試みる。

```
NAMESPACE   NAME                                AGE   STATUS             READY
default     virtualmachine.kubevirt.io/testvm   23m   CrashLoopBackOff   False
```

# krew

kubernetesのプラグインマネージャ

https://krew.sigs.k8s.io/docs/user-guide/setup/install/


```
microk8s kubectl krew
```

# virtctl

https://kubevirt.io/user-guide/operations/virtctl_client_tool/#install-virtctl-with-krew

```
export VERSION=v0.41.0
wget https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/virtctl-${VERSION}-linux-amd64

mv virtctl-${VERSION}-linux-amd64 virtctl
sudo mv virtctl /usr/bin
```

```
microk8s kubectl virt start testvm
```


# 用語

- crd: ??? `kubectl get crds`


sudo apt-get install qemu-kvm qemu
minikube start --driver=qemu2

kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
kubectl expose deployment hello-minikube --type=NodePort --port=8080
kubectl get services hello-minikube
minikube service hello-minikube
kubectl port-forward service/hello-minikube 7080:8080
http://localhost:7080/


minikube addons enable kubevirt
export VERSION=$(curl -s https://api.github.com/repos/kubevirt/kubevirt/releases | grep tag_name | grep -v -- '-rc' | sort -r | head -1 | awk -F': ' '{print $2}' | sed 's/,//' | xargs)
echo $VERSION
kubectl create -f https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/kubevirt-operator.yaml

kubectl create -f https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/kubevirt-cr.yaml
kubectl get kubevirt.kubevirt.io/kubevirt -n kubevirt -o=jsonpath="{.status.phase}"
kubectl get all -n kubevirt
kubectl logs pod/kubevirt-install-manager -n kube-system

https://minikube.sigs.k8s.io/docs/start/



# 新しいWindowsを買ったらやること

- パフォーマンスを優先する（以下のみチェックしておくとよい）
    - アイコンの代わりに縮小版を表示する
    - スクリーンフォントの縁を滑らかにする


- 画像やテキストの縁を滑らかにする -> オフ