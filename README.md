# use-safety

The library for safety install from npm repository (Artifactory et al.)

### How to Use

```bash
npx use-safety i
```

```bash
npx use-safety i moment
```

```bash
npx use-safety i moment -- --save-dev
```

```bash
npx use-safety --help
```

### Configuration by *.env*

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
USE_SAFETY_REGISTRY=https://registry.npmjs.org/
USE_SAFETY_USERNAME=user
USE_SAFETY_PASSWORD=pass
USE_SAFETY_ROOT_DIR=.
USE_SAFETY_LOG=1
```