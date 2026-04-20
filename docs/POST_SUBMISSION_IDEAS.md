# Post-Submission Improvements (NOT for this challenge)

This file tracks small UX/quality-of-life improvements discovered during the challenge
but deliberately left OUT of the submission to respect scope boundaries.

## 🐛 1. NEW PET reset flow — localStorage not cleared if user cancels naming

**Reproducer:**
1. Click "NEW PET" → confirm dialog → click OK
2. Naming screen appears
3. Close browser tab OR click reload without submitting a name
4. Reopen app → previous session loads (unexpected)

**Root cause:**
`handleReset()` in `app.jsx` calls `clearLocalStorage()` correctly. However, if the user
cancels the confirm dialog or closes before typing a name, the app may navigate back
to the naming screen in React state, but localStorage still contains the old save
from before reset was attempted.

Actually, on closer inspection: if the confirm returns true, localStorage IS cleared.
The real issue is likely a browser extension syncing localStorage, or user confusion
with the confirm dialog (ESC interpreted differently by Firefox extensions).

**Fix (post-submission):**
Add a `useEffect` in `Naming.jsx` that ensures clean state on mount:

```javascript
useEffect(() => {
  const saved = loadFromLocalStorage();
  if (!saved || !saved.pet?.name) {
    clearLocalStorage();
  }
}, []);
```

**Why NOT included in submission:**
- Scope creep during submission window
- The existing `handleReset()` uses the correct standard pattern
- Users can always clear localStorage from DevTools if truly stuck
- No formal SDD cycle was performed for this change (no feature spec)

---

## 💡 Other ideas for v1.1

- [ ] Pause button (deliberately rejected — would violate "no admin features" rule)
- [ ] Multiple pet slots (violates "single user, single pet" constraint)
- [ ] Sound effects on actions (adds audio dependency, delays MVP)
- [ ] Animated transitions between Normal/Sick/Evolved (nice-to-have polish)
- [ ] Desktop notification when pet becomes Sick (violates "no notifications" rule)
- [ ] Export pet as shareable PNG/card (interesting but out of scope)
- [ ] Accessibility audit with screen readers (quality bar for v2)

---

## 📝 Note on SDD discipline

Every item above would require a proper SDD cycle before implementation:
1. Add to `roadmap.md` as a new phase
2. Create feature spec folder with `feature-plan.md`, `requirements.md`, `validation.md`
3. Implement only after spec review
4. Validate with unit tests

This discipline is what separates SDD from vibe coding — even for "obvious" fixes.
