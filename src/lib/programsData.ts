export interface ProgramModule {
  id: string; // '01', '02', etc.
  title: string;
  summary: string;
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
        summary: 'Understanding Python memory model, mutability, OOP patterns, closures, generators, UV/venv tooling, and Git workflow.',
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
        summary: 'Linear algebra in code, calculus, gradient descent from scratch, vectorized NumPy operations, and Pandas data wrangling.',
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
        summary: 'Data cleaning, missing values imputation, outlier handling, Seaborn/Matplotlib diagnostic plots, and PCA.',
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
        summary: 'Regression models (OLS, Ridge, Lasso), Classification (Logistic Regression), Tree Ensembles (XGBoost), SVM, and K-Fold validation.',
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
        summary: 'K-Means, DBSCAN clustering, Perceptrons, MLPs, PyTorch tensors, autograd engine, custom nn.Module, and optimizers.',
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
        summary: 'Joblib/ONNX serialization, high-performance REST APIs with FastAPI, Streamlit live dashboards, and Capstone project showcase.',
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
        summary: 'Philosophy of open source, licenses (MIT, Apache, GPL), the global ecosystem, and anatomy of a GitHub repository.',
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
        summary: 'Navigating large codebases, folder conventions, reading real Python libraries, and leveraging AI for code comprehension.',
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
        summary: 'Git workflow from scratch, feature branching, merge strategies, conflict resolution, and writing great README documentation.',
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
        summary: 'Types of contributions, finding good first issues, unit tests, linters, and working constructively with maintainers.',
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
        summary: 'Using open source as a textbook, building a CLI tool from scratch, automating CI/CD with GitHub Actions, and GSoC/LFX showcase.',
        subtopics: [
          'Learning by Reading Source: Studying production frameworks by reading their internals',
          'Starting Your Own OS Project: Scoping a CLI tool, clean structure & compelling README',
          'CI/CD with GitHub Actions: Automating tests, linting & releases on every push',
          'OS Programs & Final Showcase: GSoC, Outreachy, LFX Mentorship overview & peer presentations'
        ]
      }
    ]
  },
  {
    id: 'java-opensource',
    title: 'Java with OpenSource',
    badge: 'Cohort • Pune',
    schedule: 'Fri, Sat & Sun, 5:30 – 7:30 PM',
    duration: '4 Months',
    link: '/programs/java-opensource/index.html',
    modules: [
      {
        id: '01',
        title: 'Introduction to Linux',
        summary: 'Understanding the Linux OS, file system hierarchy, terminal commands, permissions, JDK setup, and Git version control.',
        subtopics: [
          'Linux Fundamentals: File system hierarchy, terminal basics & industry standard',
          'Essential Commands: Navigation, cp/mv/rm, chmod/chown, piping, redirection & shell scripting',
          'Development Environment Setup: Installing JDK on Linux, PATH, JAVA_HOME, compiling & running',
          'Git & Version Control: init, add, commit, push, pull, branching & GitHub collaboration'
        ]
      },
      {
        id: '02',
        title: 'Java Fundamentals & Language Basics',
        summary: 'JDK, JRE, JVM overview, data types, variables, type casting, operators, flow control, declarations, and access modifiers.',
        subtopics: [
          'Java Fundamentals: JDK, JRE, JVM overview, writing first program, data types, variables & type casting',
          'Operators & Assignments: Arithmetic, relational, logical, bitwise, ternary & precedence rules',
          'Flow Control: if-else, switch, for, while, do-while, break, continue & nested loops',
          'Declarations & Access Modifiers: Class declarations, variable scopes, public/private/protected/default'
        ]
      },
      {
        id: '03',
        title: 'Object-Oriented Programming',
        summary: 'Classes, objects, inheritance, polymorphism, abstraction, encapsulation, interfaces, abstract classes, inner classes, and packages.',
        subtopics: [
          'OOP Principles: Classes, objects, inheritance, polymorphism, abstraction & encapsulation',
          'Interfaces & Abstract Classes: Contracts, abstract methods, default methods & design patterns',
          'Inner Classes: Member inner classes, static nested classes, local & anonymous inner classes',
          'Packages: Organizing code with packages, import statements & modular Java applications'
        ]
      },
      {
        id: '04',
        title: 'Exception Handling & Multi-Threading',
        summary: 'Try-catch-finally, checked vs unchecked exceptions, custom exceptions, Thread class, Runnable, synchronization, and deadlock prevention.',
        subtopics: [
          'Exception Handling: Try-catch-finally, checked vs unchecked, throw/throws & custom exceptions',
          'Multi-Threading: Thread class, Runnable interface, thread lifecycle & concurrent programming',
          'Synchronization, inter-thread communication & deadlock prevention'
        ]
      },
      {
        id: '05',
        title: 'File I/O, Serialization & Collections',
        summary: 'Byte and character streams, object serialization, the Java Collections Framework (List, Set, Map, Queue), and Generics.',
        subtopics: [
          'File I/O: FileReader, FileWriter, BufferedReader, BufferedWriter, byte & character streams',
          'Serialization: ObjectInputStream, ObjectOutputStream, Serializable interface & transient keyword',
          'Collections Framework: ArrayList, HashMap, HashSet, LinkedList, TreeMap & iterators',
          'Generics: Generic classes, methods, bounded types, wildcards & type erasure'
        ]
      },
      {
        id: '06',
        title: 'JVM Internals & Garbage Collection',
        summary: 'ClassLoader, bytecode, JIT compilation, memory areas (heap, stack, method area), garbage collection algorithms, and performance profiling.',
        subtopics: [
          'JVM Architecture: ClassLoader, bytecode, JIT compilation & runtime data areas (heap, stack, method area)',
          'Garbage Collection: GC roots, mark-and-sweep, generational GC, G1 collector, memory leaks & finalize()',
          'Performance & Debugging: JVM flags, profiling tools, heap dumps, thread dumps & bottleneck diagnosis'
        ]
      },
      {
        id: '07',
        title: 'Open Source Projects — JSQLParser & Elasticsearch',
        summary: 'Navigating production Java repositories, AST traversal with JSQLParser, distributed search with Elasticsearch, and submitting upstream PRs.',
        subtopics: [
          'JSQLParser: Codebase architecture, SQL parsing, AST traversal & contributing to open-source SQL parsing',
          'Elasticsearch: Distributed systems, indexing, querying & contributing to search engine codebase',
          'Reading & Navigating Large Codebases: Maven/Gradle build systems, test suites & finding entry points',
          'Contributing & Building Portfolio: Good first issues, writing PRs, engaging maintainers & showcasing contributions'
        ]
      }
    ]
  }
];

export function getProgramById(id: string): ProgramDefinition | undefined {
  return PROGRAMS.find(p => p.id === id);
}
