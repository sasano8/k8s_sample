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



