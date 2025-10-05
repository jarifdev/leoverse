# Crisis Management - Quick Setup

## 🚀 3-Step Setup

### Step 1: Run Database Migration
```bash
mysql -u root -p leoverse < c:/Users/jbinn/Documents/leo/db_ver/add_crisis_management_columns.sql
```

### Step 2: Verify Database
```sql
USE leoverse;
DESCRIBE leaderboard;
-- Should show: crisis_decision, crisis_si_impact, crisis_cost

DESCRIBE missions;
-- Should show: crisis_decision, crisis_si_impact, crisis_cost
```

### Step 3: Test the Flow
1. Go to http://localhost:3000
2. Login and complete a mission
3. Click "Crisis Management" in navbar
4. Select a crisis option and submit
5. View final results
6. Click "Play Again"

---

## ✅ Testing Checklist

- [ ] Database migration successful
- [ ] Crisis page loads with alert
- [ ] Can select crisis option
- [ ] Submit updates score
- [ ] Final results display
- [ ] Leaderboard updates
- [ ] Play Again resets everything

---

## 🎮 Crisis Options Quick Reference

| Option | Cost | SI Impact | Risk |
|--------|------|-----------|------|
| Ignore | $0M | -30 to -10 (random) | HIGH |
| Cleanup | $200M | +15 (fixed) | NONE |
| Treaty | $150M | +10 (fixed) | NONE |

---

## 🔍 Verify API Endpoint

Test crisis API directly:
```bash
curl -X POST http://localhost/leo/api/leaderboard/crisis.php \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "your_user_id",
    "mission_id": "your_mission_id",
    "final_si_score": 75.5,
    "crisis_decision": "cleanup",
    "crisis_si_impact": 15,
    "crisis_cost": 200
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "final_score": 75.5,
    "crisis_decision": "cleanup",
    "crisis_si_impact": 15,
    "crisis_cost": 200,
    "rank": 12
  }
}
```

---

## 🐛 Quick Troubleshooting

**Problem:** Database columns not added
- **Solution:** Check MySQL credentials and run migration again

**Problem:** API returns 404
- **Solution:** Complete a mission first (Crisis requires existing leaderboard entry)

**Problem:** Play Again doesn't work
- **Solution:** Hard refresh browser (Ctrl + Shift + R)

**Problem:** Budget shows negative
- **Solution:** This is intentional! Player overspent.

---

## 📊 Check Results in Database

```sql
-- View recent crisis decisions
SELECT 
    u.username,
    l.si_score as final_score,
    l.crisis_decision,
    l.crisis_si_impact,
    l.crisis_cost,
    l.updated_at
FROM leaderboard l
JOIN users u ON l.user_id = u.id
WHERE l.crisis_decision IS NOT NULL
ORDER BY l.updated_at DESC
LIMIT 5;
```

---

## 📁 Files Modified

### Frontend
- ✅ `app/crisis/page.js` - Main crisis page (NEW)
- ✅ `components/Navbar.js` - Added crisis link
- ✅ `lib/api.js` - Added crisis API method

### Backend
- ✅ `api/leaderboard/crisis.php` - Crisis endpoint (NEW)

### Database
- ✅ `db_ver/add_crisis_management_columns.sql` - Migration (NEW)

### Documentation
- ✅ `CRISIS_MANAGEMENT_GUIDE.md` - Full guide (NEW)
- ✅ `CRISIS_QUICK_SETUP.md` - This file (NEW)

---

## 🎯 User Flow Summary

```
Login → Country → Payload → Mission Builder → Submit
    ↓
Leaderboard entry created (Stage 1)
    ↓
Optional: Orbital Path (Stage 2)
    ↓
Crisis Management (FINAL STAGE)
    ↓
Final Results → Play Again
```

---

## 💡 Pro Tips

1. **Test with different budgets** - Try expensive missions to see negative budgets
2. **Try "Ignore" multiple times** - Random penalty varies each time
3. **Compare scores** - See how crisis decisions affect ranking
4. **Budget planning** - Leave enough for crisis options
5. **Use Play Again** - Test different strategies quickly

---

Ready to test! 🚀
