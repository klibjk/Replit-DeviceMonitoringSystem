# Manual Test Reports

## Manual Test Report #1
**Issue**: Device editing functionality doesn't retain values when navigating between pages.

**Steps to Reproduce**:
1. Go to the Devices page
2. Click "Edit" on a device 
3. Navigate to another page
4. Return to the Devices page
5. Click "Edit" on the same device

**Expected**: The device editing modal should display the correct device information.
**Actual**: The device editing modal resets all values.

**Status**: ✅ FIXED
**Fix Commit**: [2023-03-24] Fixed device editing state persistence (hash: bc277d0b9363885fbae9758e8a6e262f3dd0cec7, 9978ec4f46d45c345260bd90fe360cedc6138bad)

---

## Manual Test Report #2
**Issue**: Alerts and Audit Logs pages don't load properly.

**Error Message**:
```
[plugin:runtime-error-plugin] A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.js.
```

**Steps to Reproduce**:
1. Navigate to the Alerts page or Audit Logs page
2. Observe that the page doesn't load properly and shows an error

**Expected**: The pages should load correctly showing all alerts or audit logs.
**Actual**: Pages display an error about SelectItem components with empty string values.

**Status**: ✅ FIXED
**Fix Commit**: [2023-03-24] Fixed SelectItem and badge components (hash: a99d35dad876105333a043e5725be97a65ef3c8c, 585033b088acd321a10898cc5f724c93564132e3)

- Updated the filter logic to use "all" instead of empty strings
- Fixed the badge component to support custom variant types (info, warning, success)
- Set default filter values to "all" for better UX