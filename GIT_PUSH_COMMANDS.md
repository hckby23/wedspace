# Git Push Commands after Analytics Integration

## 1. Review Changes
```bash
git status
```

## 2. Stage Files
```bash
git add package.json package-lock.json src/app/layout.tsx
```

## 3. Commit
```bash
git commit -m "chore: add vercel analytics tracking"
```

## 4. Push to GitHub
```bash
git push origin main
```

## 5. Redeploy on Vercel
- Visit https://vercel.com/dashboard
- Select the `wedspace` project
- Click **Deployments** → **Redeploy** latest commit
