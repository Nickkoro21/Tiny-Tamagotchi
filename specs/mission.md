# Mission — Tiny Tamagotchi

## Vision

Tiny Tamagotchi is a single-page web app that simulates a virtual pet — a classic blob creature with a **sci-fi / techy personality**. The pet lives in a digital habitat, responds to player care actions, and evolves or deteriorates based on attention. Think retro Tamagotchi mechanics meets cyberpunk aesthetics: glitch effects when sick, data-stream animations when happy, and tech jargon in its reactions.

## Why This Project Exists

This project serves as a **Spec-Driven Development showcase** for the DeepLearning.AI 7-Day Learner Challenge. The primary goal is to demonstrate mastery of the SDD workflow — constitution, feature specs, plan-implement-validate loops — while producing a functional, polished web app.

The secondary goal is to build a portfolio piece that demonstrates disciplined software engineering with AI coding agents.

## Target Audience

- **Primary:** Challenge reviewers evaluating SDD spec quality, internal consistency, and testability
- **Secondary:** Developers interested in SDD methodology and workflow examples
- **Tertiary:** Anyone who enjoys casual virtual pet web apps

## Core Concept

A single user cares for a single digital pet through three core actions (Feed, Play, Rest). The pet has three vital stats (Hunger, Happiness, Energy) that decay over time, creating urgency. Neglect leads to sickness; consistent care leads to evolution. The pet has a unique techy personality expressed through quirky reactions and easter eggs.

## The Four Pillars

### 1. Living Vitals
Three stats (Hunger, Happiness, Energy) on a 0–100 scale that decrease automatically over time. Visual indicators show the pet's current condition at a glance.

### 2. The Care Loop
Three player actions — **Feed**, **Play**, **Rest** — each restore specific stats. Actions have cooldowns to encourage balanced care rather than button-mashing.

### 3. Dynamic States
The pet transitions between states based on vitals:
- **Normal** → default healthy state
- **Sick** → triggered when any stat drops critically low; requires recovery actions
- **Evolved** → achieved through sustained good care over time

Each state has distinct visual feedback (animations, color shifts, UI changes).

### 4. Personal Touches
Easter eggs, quirky reactions, and personality traits that make the pet feel unique:
- Tech-themed dialogue (e.g., "Running low on RAM... need rest 💤")
- Contextual reactions based on stat combinations
- Hidden interactions or milestones

## Scope Boundaries

### In Scope
- Single pet, single user, single page
- Pet naming at start
- One evolution path (Normal → Evolved)
- One recovery path (Sick → Normal)
- Stat decay over real time
- Responsive design (mobile + desktop)
- Visual state feedback (animations/transitions)
- Persistent state via localStorage

### Out of Scope (Challenge Rules)
- ❌ Authentication or multiple users
- ❌ Multiple pets
- ❌ Mini-games
- ❌ Social features or notifications
- ❌ Admin features
- ❌ Complex evolution trees
- ❌ Permanent death
- ❌ Inventories or currencies

## Success Criteria

1. **Spec Quality:** Constitution and feature specs are complete, clear, internally consistent, and testable
2. **Functional App:** All four pillars work as specified with no critical bugs
3. **Video Walkthrough:** Demonstrates the working app and SDD process
4. **Clean Repo:** Organized folder structure matching submission requirements

## Deadline

**Wednesday, April 22, 2026 — 11:59 PM PST**
