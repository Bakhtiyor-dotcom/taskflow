TaskFlow — Auth Design Update

Copy the contents of the folders in this archive into the same paths
inside your existing taskflow project. Replace existing files when prompted.

Changed/new files:
  components/auth-shell.tsx      (new)
  components/login-form.tsx      (replace)
  components/sign-up-form.tsx    (replace)
  app/auth/login/page.tsx        (replace)
  app/auth/sign-up/page.tsx      (replace)

Then run:
  npm run dev

Open:
  http://localhost:3000/auth/login
  http://localhost:3000/auth/sign-up

When verified:
  git add .
  git commit -m "Redesign TaskFlow auth pages"
  git push
