# 🧠 Relative Date Parsing Strategy

**Last updated:** February 2026 · **Current stable:** v2.1.6

This document outlines the strategy for implementing Natural Language date entry (e.g., "next Friday", "in 2 weeks") in `ngxsmk-datepicker`.

## 🎯 Objective
Allow users to type human-readable strings into the input field and have them automatically converted into valid `Date` objects.

## 🛠️ Implementation Plan

### 1. Token Recognition
The `DatepickerParsingService` will be extended with a regex-based token matcher:
- **Relative Keywords**: `next`, `last`, `this`, `in`, `ago`
- **Units**: `day`, `week`, `month`, `year`
- **Weekdays**: `monday`, `tue`, `wednesday`, etc.
- **Specifics**: `today`, `tomorrow`, `yesterday`

### 2. Logic Flow
1. **Sanitize**: Strip non-alphanumeric characters.
2. **Match**: Check if the string matches any relative patterns.
3. **Calculate**:
   - `tomorrow` -> `new Date() + 1 day`
   - `next friday` -> Find the first Friday after `today`.
   - `2 weeks from now` -> `new Date() + 14 days`.
4. **Fallback**: If no relative match is found, proceed to standard date parsing.

## 📦 Recommended Libraries
To keep the bundle small, we should implement a lightweight custom parser or use an optional adapter for:
- [Chrono](https://github.com/wanasit/chrono) (Powerful but larger)
- [date-fns/add](https://date-fns.org/v3.3.1/docs/add) (Modular and lightweight)

## 🚀 UX Integration
- **Ghost Text**: As the user types "next f", show "next Friday" as ghost text in the input.
- **Instant Preview**: Update the calendar view immediately as a relative date is recognized.
