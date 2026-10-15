TaskFlow — Mobile Dashboard Update

Included:
  app/dashboard/page.tsx

Install on Mac (from a terminal):
  cd ~/Projects/taskflow
  unzip -o ~/Downloads/taskflow_mobile_update.zip -d .

Note: This overwrites only app/dashboard/page.tsx.
Do not replace app/page.tsx (the public landing page).

Test locally:
  npm run dev
  http://localhost:3000/dashboard

After verifying the desktop and phone layout:
  git add app/dashboard/page.tsx
  git commit -m "Improve TaskFlow mobile dashboard"
  git push

Vercel will deploy after the push.
