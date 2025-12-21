# Reinitialize Git Repository

## Steps to Remove and Reinitialize Git

### 1. Remove .git directory
```bash
rm -rf .git
```

### 2. Initialize new git repository
```bash
git init
```

### 3. Add all files (venv/ will be ignored by .gitignore)
```bash
git add .
```

### 4. Make initial commit
```bash
git commit -m "Initial commit - clean repository without venv/"
```

### 5. Add remote (if needed)
```bash
git remote add origin https://github.com/mentorque/Extension_Free_backend.git
```

### 6. Push to GitHub
```bash
git branch -M main
git push -u origin main --force
```

**Warning:** `--force` will overwrite the remote repository. Make sure you want to do this!

## Alternative: Create new repository
If you want to keep the old one, create a new repository and push there instead.

