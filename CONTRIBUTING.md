# Contributing to NeoTutor-AI 🤖✨

First off, thank you for considering contributing to NeoTutor-AI! We're excited to see you here. This project is built by the community, and every contribution, no matter how small, is valuable.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [How Can I Contribute?](#how-can-i-contribute)
    * [Reporting Bugs](#reporting-bugs)
    * [Suggesting Enhancements](#suggesting-enhancements)
    * [Pull Requests](#pull-requests)
* [Development Setup](#development-setup)
* [Style Guide](#style-guide)
    * [Git Commit Messages](#git-commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior. (Note: You will need to add a `CODE_OF_CONDUCT.md` file. You can find many standard templates online, like the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)).

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as [GitHub issues](https://github.com/ProgrammerKR/NeoTutor-AI/issues). Before you create a bug report, please check the existing issues to see if your problem has already been reported.

When creating a bug report, please include as many details as possible:

* **A clear and descriptive title** for the issue.
* **Steps to reproduce** the bug.
* **What you expected to happen** vs. **what actually happened**.
* **Screenshots or screen recordings** (if applicable).
* **Your environment:** (e.g., OS, Browser, Node.js version).

### Suggesting Enhancements

We'd love to hear your ideas for improving NeoTutor-AI! Please create an [issue](https://github.com/ProgrammerKR/NeoTutor-AI/issues/new) and use the "enhancement" label.

When suggesting a new feature, please:

* **Use a clear and descriptive title.**
* **Explain the problem** your enhancement solves (the "why").
* **Describe the solution** you'd like to see implemented (the "what").
* **Provide mockups or examples** if possible.

### Pull Requests

This is the best way to contribute code. We follow the standard "fork-and-pull" workflow.

1.  **Fork the repository** to your own GitHub account.
2.  **Clone your fork** to your local machine:
    ```bash
    git clone [https://github.com/YOUR-USERNAME/NeoTutor-AI.git](https://github.com/YOUR-USERNAME/NeoTutor-AI.git)
    cd NeoTutor-AI
    ```
3.  **Create a new branch** for your feature or fix. Please use a descriptive name:
    ```bash
    # For a new feature
    git checkout -b feature/your-amazing-feature
    
    # For a bug fix
    git checkout -b fix/bug-description
    ```
4.  **Make your changes!** Write your code and add/update tests as needed.
5.  **Commit your changes.** Please follow our [commit message guidelines](#git-commit-messages).
    ```bash
    git add .
    git commit -m "feat: Add amazing new feature"
    ```
6.  **Push your branch** to your fork:
    ```bash
    git push origin feature/your-amazing-feature
    ```
7.  **Open a Pull Request (PR)** from your fork to the `main` branch of the `ProgrammerKR/NeoTutor-AI` repository.
8.  **Describe your PR:**
    * Explain the changes you made.
    * Link to any related issues (e.g., `Closes #123`).
    * A project maintainer will review your PR, provide feedback, and merge it when it's ready.

## Development Setup

The setup instructions are in the [README.md](README.md#getting-started). Make sure you have:

1.  Node.js and npm installed.
2.  Cloned the repository.
3.  Run `npm install` to install dependencies.
4.  Created a `.env.local` file with your `GEMINI_API_KEY`.
5.  Run `npm run dev` to start the development server.

## Style Guide

### Git Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. This helps keep the commit history clean and automates changelog generation.

Your commit message should be structured as follows:

<type>[optional scope]: <description>
[optional body]
[optional footer(s)]

**Common Types:**

* **feat:** A new feature.
* **fix:** A bug fix.
* **docs:** Documentation only changes.
* **style:** Changes that do not affect the meaning of the code (white-space, formatting, etc).
* **refactor:** A code change that neither fixes a bug nor adds a feature.
* **chore:** Changes to the build process or auxiliary tools.

**Example:**
`feat: Add dynamic quiz generation feature`
`fix: Correctly parse multi-line PDF summaries`
`docs: Update README with contribution guidelines`

---

Built with ❤️ by ProgrammerKR.
