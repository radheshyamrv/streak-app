import Challenge from "../models/Challenge.js";
import DailyChallenge from "../models/DailyChallenge.js";
import { toDateKey } from "../utils/date.js";

export async function getTodayChallenge(req, res) {
  const date = toDateKey();
  let daily = await DailyChallenge.findOne({ user: req.user._id, date }).populate("challenge");

  if (!daily) {
    const recent = await DailyChallenge.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("challenge");

    const excluded = recent.map(x => String(x.challenge));
    let candidates = await Challenge.find({
      active: true,
      difficulty: { $in: ["medium", "hard"] },
      _id: { $nin: excluded }
    });

    if (!candidates.length) {
      candidates = await Challenge.find({
        active: true,
        difficulty: { $in: ["medium", "hard"] }
      });
    }

    if (!candidates.length) {
      return res.status(500).json({ message: "No PFC challenges have been seeded." });
    }

    // Favor hard challenges roughly half the time.
    const hard = candidates.filter(c => c.difficulty === "hard");
    const medium = candidates.filter(c => c.difficulty === "medium");
    const pool = hard.length && Math.random() < 0.55 ? hard : medium.length ? medium : hard;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    daily = await DailyChallenge.create({
      user: req.user._id,
      challenge: selected._id,
      date
    });
    await daily.populate("challenge");
  }

  res.json(daily);
}

export async function completeTodayChallenge(req, res) {
  const date = toDateKey();
  const daily = await DailyChallenge.findOne({ user: req.user._id, date }).populate("challenge");

  if (!daily) return res.status(404).json({ message: "Today's challenge has not been generated yet." });

  daily.completed = true;
  daily.completedAt = new Date();
  daily.note = req.body.note || "";
  await daily.save();

  res.json(daily);
}

export async function challengeHistory(req, res) {
  const history = await DailyChallenge.find({ user: req.user._id })
    .populate("challenge")
    .sort({ date: -1 })
    .limit(30);

  res.json(history);
}
