export interface ProgramModule {
  id: string; // '01', '02', etc.
  title: string;
  subtopics?: string[];
}

export interface ProgramDefinition {
  id: string;
  title: string;
  badge: string;
  schedule: string;
  duration: string;
  link: string;
  modules: ProgramModule[];
}

export const PROGRAMS: ProgramDefinition[] = [
  {
    id: 'python-ml',
    title: 'Python with Machine Learning',
    badge: 'Active Cohort • Narhe, Pune',
    schedule: 'Fri, Sat & Sun, 7:00 – 9:00 PM',
    duration: '4 Months',
    link: '/programs/python-ml/index.html',
    modules: [
      {
        id: '01',
        title: 'Advanced Python & Software Engineering Craft',
        subtopics: [
          'Python Internals: Memory model, mutability, references, namespaces & garbage collection',
          'Advanced OOP & Patterns: Classes, inheritance, mixins, dunder methods & properties',
          'Functional Paradigm: First-class functions, closures, decorators & generators',
          'Environment & Tooling: Virtual environments (uv/venv), packaging & Git workflow'
        ]
      },
      {
        id: '02',
        title: 'Mathematics for ML & Scientific Computing (NumPy & Pandas)',
        subtopics: [
          'Linear Algebra in Code: Vectors, matrices, dot products, eigenvalues & factorization',
          'Optimization & Calculus: Derivatives, gradients, vector calculus & Gradient Descent from scratch',
          'NumPy Mastery: N-dimensional arrays, vectorization, SIMD operations & broadcasting rules',
          'Pandas for Data Wrangling: DataFrames, multi-indexing, aggregation, grouping, merges & joins'
        ]
      },
      {
        id: '03',
        title: 'Exploratory Data Analysis & Feature Engineering',
        subtopics: [
          'Data Cleaning & Imputation: Missing values, statistical imputations & IQR outlier detection',
          'Data Visualization: Diagnostic statistical plots with Matplotlib, Seaborn & correlation heatmaps',
          'Feature Transformation: One-hot encoding, target encoding, standard scaling & power transforms',
          'Dimensionality Reduction: Principal Component Analysis (PCA) theory, implementation & scree plots'
        ]
      },
      {
        id: '04',
        title: 'Supervised Learning: Classical Algorithms in Depth',
        subtopics: [
          'Regression Models: Ordinary Least Squares, Ridge (L2), Lasso (L1) & ElasticNet',
          'Classification Models: Logistic Regression, Sigmoid activation & Decision Boundaries',
          'Tree-Based & Ensembles: Decision Trees, Gini Impurity, Random Forests & Gradient Boosting (XGBoost)',
          'Support Vector Machines: Hyperplanes, maximal margins & non-linear kernels (RBF/Polynomial)',
          'Evaluation & Validation: K-Fold Cross-Validation, Precision, Recall, F1-Score & ROC-AUC'
        ]
      },
      {
        id: '05',
        title: 'Unsupervised Learning & Deep Learning Foundations',
        subtopics: [
          'Clustering Algorithms: K-Means clustering, Elbow method, Silhouette analysis & DBSCAN',
          'Neural Network Essentials: Perceptrons, Multi-Layer Perceptrons & activations (ReLU, GELU, Softmax)',
          'PyTorch Fundamentals: Tensors, computational graphs, Autograd engine & custom nn.Module',
          'Training Pipeline: Loss functions (MSE, Cross-Entropy), forward passes, backpropagation & Adam/SGD'
        ]
      },
      {
        id: '06',
        title: 'Model Deployment, Production ML & Capstone',
        subtopics: [
          'Model Serialization: Exporting production artifacts via Joblib, Pickle & ONNX runtimes',
          'REST API Serving: Building high-performance inference microservices using FastAPI & Pydantic',
          'Interactive Dashboards: Rapidly building live prediction dashboards with Streamlit',
          'Capstone Showcase: Deliver, deploy, and present an end-to-end Machine Learning pipeline project'
        ]
      }
    ]
  },
  {
    id: 'open-source',
    title: 'Open Source Mindset',
    badge: 'Flagship Initiative • Pune',
    schedule: 'Sat & Sun, 5:30 – 7:30 PM',
    duration: '4 Months',
    link: '/programs/open-source/index.html',
    modules: [
      {
        id: '01',
        title: 'Introduction to Open Source',
        subtopics: [
          'What is Open Source?: Philosophy of open source, real-world examples & modern software foundations',
          'Licenses & Legality: MIT, Apache, GPL — permissions, restrictions & choosing licenses',
          'The OS Ecosystem: Linux, Python, VS Code & career benefits of open source',
          'Anatomy of a GitHub Repo: README, Issues, Pull Requests, Stars, Forks & Discussions'
        ]
      },
      {
        id: '02',
        title: 'Reading & Understanding Open Source Code',
        subtopics: [
          'Navigating a Large Codebase: Folder structure conventions, changelogs & GitHub blame',
          'Python Basics by Reading Real Code: Variables, control flow, functions & classes in Flask/requests',
          'Using AI to Understand Code: Prompting LLMs to explain functions, debug errors & map code flow',
          'Python Project Structure: __init__.py, setup.py, pyproject.toml & running locally',
          'Hands-on Practice: Modifying open-source Python code locally to build confidence',
          'Issues & Roadmaps: Reading "good first issue" tags, milestones & release plans'
        ]
      },
      {
        id: '03',
        title: 'Git & GitHub Version Control',
        subtopics: [
          'Git from Scratch: init, add, commit, push, pull — full local-to-remote workflow',
          'Branching & Merging: Creating feature branches, merge strategies & resolving merge conflicts',
          'GitHub Collaboration Flow: Fork vs Clone, opening PRs, writing Issues & GitHub Flow',
          'Writing Great READMEs: Markdown deep dive, CONTRIBUTING.md & CODE_OF_CONDUCT.md'
        ]
      },
      {
        id: '04',
        title: 'Make Your First Contribution',
        subtopics: [
          'Types of Contributions: Documentation, translations, bug reports, unit tests & design',
          'Your First Code Fix: Fixing typos, adding tests, PEP8 linters & formatters',
          'Working with Maintainers: Writing professional PR descriptions & responding to review feedback',
          'Contribution Sprint: Finding open "good first issues" and submitting a real pull request'
        ]
      },
      {
        id: '05',
        title: 'Build Your Own Project',
        subtopics: [
          'Learning by Reading Source: Studying production frameworks by reading their internals',
          'Starting Your Own OS Project: Scoping a CLI tool, clean structure & compelling README',
          'CI/CD with GitHub Actions: Automating tests, linting & releases on every push',
          'OS Programs & Final Showcase: GSoC, Outreachy, LFX Mentorship overview & peer presentations'
        ]
      }
    ]
  }
];

export function getProgramById(id: string): ProgramDefinition | undefined {
  return PROGRAMS.find(p => p.id === id);
}
