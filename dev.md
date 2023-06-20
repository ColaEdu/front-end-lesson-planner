## 设计稿

https://www.figma.com/file/P9y11wjwHA6CqugJJ2Fuiw/ColaEdu?type=design&node-id=102-6345&t=ZrMX7swkJdItFkOD-0

## QUICK START 

```
npm run dev
```

## 部署

```bash
# 1. 推送代码至master
# 2. 登录服务器
ssh ubuntu@129.226.81.213
# 3. 进入服务器代码仓库
cd /home/ubuntu/codes/front-end-lesson-planner
# 4. 在服务器上拉取最新的代码
git pull
# 5. 在服务器上打包 ? 目前存在问题， 采用本地打包后scp
npm run build-prod
scp -r build ubuntu@129.226.81.213:/home/ubuntu/codes/lesson-planner-frontend
```

## bug记录

### editor.read 与 editor.update

### Q: ask ai的选区展示与恢复

1. 点击ask ai，记录当前编辑器状态
2. ai弹窗展示，高亮当前选区文本状态
3. 点击关闭，恢复点击ask ai时的编辑器状态