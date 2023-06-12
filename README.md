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