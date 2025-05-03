/**
 * Represents a single quiz question.
 * @typedef {object} QuizQuestion
 * @property {number} id - Unique identifier for the question.
 * @property {string} category - The category of the question (e.g., 'Langage C').
 * @property {string} questionText - The text of the question.
 * @property {Array<QuizOption>} options - An array of possible answers.
 * @property {string} explanation - The explanation for the correct answer.
 * @property {boolean} [multipleCorrect=false] - Indicates if multiple options can be correct.
 */

/**
 * Represents a single option for a quiz question.
 * @typedef {object} QuizOption
 * @property {string} text - The text of the option (e.g., 'A. 2 octets').
 * @property {boolean} correct - Whether this option is the correct answer.
 */

export class QuizModel {

    constructor() {

        /** @type {QuizQuestion[]} */
        this.questions = [
            // --- Langage C ---
            {
                id: 1, category: 'Langage C', questionText: 'Quelle est la taille typique (en octets) d\'un pointeur en C sur une architecture 64 bits ?',
                options: [ { text: '2 octets', correct: false }, { text: '4 octets', correct: false }, { text: '8 octets', correct: true }, { text: 'Dépend du type pointé', correct: false } ],
                explanation: 'Sur une architecture 64 bits, un pointeur contient une adresse mémoire de 64 bits, soit 8 octets, quelle que soit la taille du type de données pointé.', multipleCorrect: false
            },
            {
                id: 2, category: 'Langage C', questionText: 'Que fait l\'opérateur `&` en C ?',
                options: [ { text: 'Déréférence un pointeur', correct: false }, { text: 'Obtient l\'adresse mémoire d\'une variable', correct: true }, { text: 'Effectue un ET logique bit à bit', correct: false }, { text: 'Déclare un pointeur', correct: false } ],
                explanation: 'L\'opérateur unaire `&` (adresse de) retourne l\'adresse mémoire de son opérande (qui doit être une lvalue, comme une variable).', multipleCorrect: false
            },
            {
                id: 3, category: 'Langage C', questionText: 'Quel est le rôle de la fonction `malloc` ?',
                options: [ { text: 'Libérer de la mémoire allouée', correct: false }, { text: 'Allouer de la mémoire sur la pile', correct: false }, { text: 'Allouer un bloc de mémoire sur le tas', correct: true }, { text: 'Copier une zone mémoire', correct: false } ],
                explanation: '`malloc` (memory allocation) est utilisée pour allouer dynamiquement un bloc de mémoire d\'une taille spécifiée (en octets) sur le tas (heap). La mémoire allouée doit être libérée manuellement avec `free`.', multipleCorrect: false
            },
             {
                id: 4, category: 'Langage C', questionText: 'Dans `struct Point { int x; char c; int y; };`, quelle est la taille probable de la structure sur une machine 32 bits (avec padding) ?',
                options: [ { text: '9 octets (4+1+4)', correct: false }, { text: '12 octets (4+1+padding+4)', correct: true }, { text: '8 octets (taille des ints)', correct: false }, { text: '10 octets', correct: false } ],
                explanation: 'Pour aligner `y` sur une frontière de 4 octets, le compilateur insère généralement 3 octets de padding après `c`. Taille = sizeof(int) + sizeof(char) + padding + sizeof(int) = 4 + 1 + 3 + 4 = 12 octets.', multipleCorrect: false
            },
            {
                id: 5, category: 'Langage C', questionText: 'Quelle est la différence principale entre `struct` et `union` ?',
                options: [ { text: 'Les membres de union partagent la même mémoire', correct: true }, { text: 'struct peut contenir des pointeurs, pas union', correct: false }, { text: 'union est plus rapide', correct: false }, { text: 'struct est alloué sur le tas, union sur la pile', correct: false } ],
                explanation: 'Dans une `union`, tous les membres occupent le même espace mémoire (superposés). Seul un membre peut être stocké à la fois. Dans une `struct`, chaque membre a son propre espace.', multipleCorrect: false
            },
             {
                id: 6, category: 'Langage C', questionText: 'Que fait `printf("%p\n", ptr);` ?',
                options: [ { text: 'Affiche la valeur pointée par ptr', correct: false }, { text: 'Affiche la taille du type pointé par ptr', correct: false }, { text: 'Affiche l\'adresse mémoire contenue dans ptr', correct: true }, { text: 'Compile le pointeur ptr', correct: false } ],
                explanation: 'Le spécificateur de format `%p` dans `printf` est utilisé pour afficher une adresse mémoire (contenue dans une variable pointeur) dans un format hexadécimal standard.', multipleCorrect: false
            },
            {
                id: 7, category: 'Langage C', questionText: 'Où sont typiquement stockées les variables locales d\'une fonction ?',
                options: [ { text: 'Sur le tas (heap)', correct: false }, { text: 'Dans le segment de données (.data)', correct: false }, { text: 'Sur la pile (stack)', correct: true }, { text: 'Dans les registres uniquement', correct: false } ],
                explanation: 'Les variables locales (déclarées à l\'intérieur d\'une fonction sans `static`) sont généralement allouées sur la pile lors de l\'appel de la fonction et désallouées automatiquement lorsque la fonction retourne.', multipleCorrect: false
            },
            {
                id: 31, category: 'Langage C', questionText: 'Que retourne `sizeof(\'A\')` en C ?',
                options: [ { text: 'La taille d\'un char (1 octet)', correct: false }, { text: 'La taille d\'un int', correct: true }, { text: 'Une erreur de compilation', correct: false }, { text: '0', correct: false } ],
                explanation: 'En C (mais pas en C++), les littéraux caractère comme \'A\' sont traités comme des `int`. `sizeof(\'A\')` retourne donc la taille d\'un `int` (souvent 4). `sizeof(char)` retourne 1.',
                multipleCorrect: false
            },
            {
                id: 32, category: 'Langage C', questionText: 'Lequel de ces éléments N\'EST PAS une section typique de la mémoire d\'un processus C ?',
                options: [ { text: 'Pile (Stack)', correct: false }, { text: 'Tas (Heap)', correct: false }, { text: 'Segment de code (.text)', correct: false }, { text: 'Cache L1', correct: true } ],
                explanation: 'La pile, le tas, le segment de code (.text), le segment de données (.data, .bss, .rodata) sont des divisions logiques de la mémoire d\'un processus. Le cache L1 est une mémoire matérielle interne au CPU, non directement gérée comme un segment par le programmeur C.',
                multipleCorrect: false
            },
            {
                id: 33, category: 'Langage C', questionText: 'Que fait la directive de préprocesseur `#include <stdio.h>` ?',
                options: [ { text: 'Compile le fichier stdio.h', correct: false }, { text: 'Lie la bibliothèque standard d\'entrées/sorties', correct: false }, { text: 'Copie le contenu de stdio.h dans le fichier source actuel', correct: true }, { text: 'Vérifie si stdio.h existe', correct: false } ],
                explanation: 'Le préprocesseur C traite les directives `#`. `#include` demande au préprocesseur de trouver le fichier spécifié (ici `stdio.h`) et d\'insérer textuellement son contenu à cet endroit avant la compilation réelle.',
                multipleCorrect: false
            },

            // --- Assembleur x86/x64 ---
            {
                id: 8, category: 'Assembleur x86', questionText: 'Quel registre est traditionnellement utilisé comme compteur dans les boucles avec l\'instruction `LOOP` ?',
                options: [ { text: 'EAX', correct: false }, { text: 'ECX', correct: true }, { text: 'EBX', correct: false }, { text: 'EDX', correct: false } ],
                explanation: 'Le registre `ECX` (Counter) est utilisé implicitement par l\'instruction `LOOP` en x86 pour décrémenter le compteur et sauter si celui-ci n\'est pas zéro.', multipleCorrect: false
            },
            {
                id: 9, category: 'Assembleur x86', questionText: 'Quelle instruction copie la valeur de `EBX` dans `EAX` ?',
                options: [ { text: 'mov eax, ebx', correct: true }, { text: 'lea eax, [ebx]', correct: false }, { text: 'xchg eax, ebx', correct: false }, { text: 'cmp eax, ebx', correct: false } ],
                explanation: 'L\'instruction `MOV destination, source` copie la valeur de la source vers la destination. `mov eax, ebx` copie donc le contenu de `EBX` dans `EAX`.', multipleCorrect: false
            },
            {
                id: 10, category: 'Assembleur x86', questionText: 'Que fait l\'instruction `CMP EAX, EBX` ?',
                options: [ { text: 'Copie EAX dans EBX si EAX > EBX', correct: false }, { text: 'Met EAX à 1 si EAX == EBX, sinon 0', correct: false }, { text: 'Soustrait EBX de EAX et met à jour les flags, sans stocker le résultat', correct: true }, { text: 'Additionne EAX et EBX et stocke dans EAX', correct: false } ],
                explanation: '`CMP` (Compare) effectue une soustraction (EAX - EBX) mais ne modifie que les drapeaux (flags) comme ZF, SF, CF, OF en fonction du résultat. Elle est utilisée avant les sauts conditionnels.', multipleCorrect: false
            },
             {
                id: 11, category: 'Assembleur x86', questionText: 'Quelle instruction saute à `label` si le Zero Flag (ZF) est à 1 ?',
                options: [ { text: 'JMP label', correct: false }, { text: 'JNE label', correct: false }, { text: 'JLE label', correct: false }, { text: 'JZ label', correct: true } ],
                explanation: '`JZ` (Jump if Zero) ou son synonyme `JE` (Jump if Equal) saute si le Zero Flag (ZF) est positionné à 1, ce qui indique typiquement que le résultat de la comparaison précédente était égal (ou que le résultat d\'une opération était zéro).', multipleCorrect: false
            },
             {
                id: 12, category: 'Assembleur x86', questionText: 'Que signifie l\'instruction `CALL my_function` ?',
                options: [ { text: 'Charge l\'adresse de my_function dans EAX', correct: false }, { text: 'Empile l\'adresse de retour et saute à my_function', correct: true }, { text: 'Compare EAX avec l\'adresse de my_function', correct: false }, { text: 'Termine le programme', correct: false } ],
                explanation: '`CALL` effectue deux actions : elle empile l\'adresse de l\'instruction suivante (l\'adresse de retour) sur la pile, puis saute à l\'adresse de la fonction appelée (`my_function`).', multipleCorrect: false
            },
            {
                id: 13, category: 'Assembleur x86', questionText: 'Quel registre pointe vers le sommet de la pile ?',
                options: [ { text: 'EBP (Base Pointer)', correct: false }, { text: 'EIP (Instruction Pointer)', correct: false }, { text: 'ESP (Stack Pointer)', correct: true }, { text: 'ESI (Source Index)', correct: false } ],
                explanation: '`ESP` (Extended Stack Pointer) contient toujours l\'adresse du sommet actuel de la pile. Il est modifié par `PUSH`, `POP`, `CALL`, `RET` et les allocations/désallocations manuelles.', multipleCorrect: false
            },
             {
                id: 14, category: 'Assembleur x86', questionText: 'L\'instruction `LEA EAX, [EBX+ECX*4]` :',
                options: [ { text: 'Lit la valeur mémoire à l\'adresse EBX+ECX*4 et la met dans EAX', correct: false }, { text: 'Calcule l\'adresse EBX+ECX*4 et la met dans EAX', correct: true }, { text: 'Multiplie EBX par ECX*4 et met le résultat dans EAX', correct: false }, { text: 'Met l\'adresse de EBX dans EAX', correct: false } ],
                explanation: '`LEA` (Load Effective Address) calcule l\'adresse spécifiée par son deuxième opérande (ici `EBX+ECX*4`) et stocke cette adresse calculée dans le premier opérande (`EAX`), sans lire la mémoire à cette adresse.', multipleCorrect: false
            },
            {
                id: 34, category: 'Assembleur x86', questionText: 'Quelle instruction est souvent utilisée pour mettre un registre à zéro de manière concise ?',
                options: [ { text: 'MOV EAX, 0', correct: false }, { text: 'SUB EAX, EAX', correct: false }, { text: 'XOR EAX, EAX', correct: true }, { text: 'AND EAX, 0', correct: false } ],
                explanation: '`XOR EAX, EAX` effectue un OU exclusif bit à bit entre EAX et lui-même, ce qui met toujours tous les bits à 0. C\'est souvent plus court (en octets d\'instruction) et parfois plus rapide que `MOV EAX, 0`.',
                multipleCorrect: false
            },
            {
                id: 35, category: 'Assembleur x86', questionText: 'Quel flag est principalement utilisé pour les comparaisons de nombres non signés ?',
                options: [ { text: 'SF (Sign Flag)', correct: false }, { text: 'OF (Overflow Flag)', correct: false }, { text: 'ZF (Zero Flag)', correct: false }, { text: 'CF (Carry Flag)', correct: true } ],
                explanation: 'Le Carry Flag (CF) est mis à 1 lors d\'une soustraction (`CMP` est une soustraction) s\'il y a un emprunt (borrow), indiquant que le premier opérande est inférieur au second en arithmétique non signée. Les sauts non signés (JA, JB, JAE, JBE) se basent sur CF et ZF.',
                multipleCorrect: false
            },
            {
                id: 36, category: 'Assembleur x64', questionText: 'Combien de registres généraux supplémentaires (R8-R15) introduit l\'architecture x64 par rapport à x86-32 ?',
                options: [ { text: '4', correct: false }, { text: '8', correct: true }, { text: '16', correct: false }, { text: 'Aucun', correct: false } ],
                explanation: 'L\'architecture x64 ajoute 8 nouveaux registres généraux 64 bits, nommés R8 à R15, en plus des versions 64 bits des registres existants (RAX, RBX, etc.).',
                multipleCorrect: false
            },

             // --- Formats Exécutables ---
            {
                id: 15, category: 'Format ELF', questionText: 'Quelle section contient typiquement le code exécutable dans un fichier ELF ?',
                options: [ { text: '.text', correct: true }, { text: '.data', correct: false }, { text: '.bss', correct: false }, { text: '.rodata', correct: false } ],
                explanation: 'La section `.text` est la section standard dans les fichiers ELF (et PE) qui contient les instructions machine (le code exécutable) du programme.', multipleCorrect: false
            },
            {
                 id: 16, category: 'Format PE', questionText: 'Quelle est la première structure lue par le loader Windows dans un fichier PE après le header DOS ?',
                 options: [ { text: 'Optional Header', correct: false }, { text: 'Section Table', correct: false }, { text: 'NT Headers (Signature + File Header + Optional Header)', correct: true }, { text: 'Import Directory Table', correct: false } ],
                 explanation: 'Après le petit header DOS (pour la compatibilité), le loader Windows cherche la signature "PE\0\0" qui marque le début des NT Headers. Ces NT Headers contiennent le File Header et l\'Optional Header, essentiels pour charger le reste du fichier.',
                 multipleCorrect: false
            },
             {
                id: 17, category: 'Formats Exécutables', questionText: 'Quel est le but principal de la table de relocalisation (relocation table) ?',
                options: [ { text: 'Stocker les chaînes de caractères', correct: false }, { text: 'Permettre au code d\'être chargé à une adresse différente de celle prévue', correct: true }, { text: 'Lister les fonctions exportées', correct: false }, { text: 'Compresser le code exécutable', correct: false } ],
                explanation: 'La table de relocalisation contient des informations sur les adresses dans le code ou les données qui doivent être ajustées si l\'exécutable est chargé à une adresse de base différente de celle pour laquelle il a été compilé. C\'est crucial pour l\'ASLR (Address Space Layout Randomization).',
                multipleCorrect: false
            },
            {
                 id: 37, category: 'Format PE', questionText: 'La table IAT (Import Address Table) dans un fichier PE contient généralement :',
                 options: [ { text: 'Les adresses des fonctions exportées par le PE', correct: false }, { text: 'Les adresses réelles des fonctions importées une fois chargées en mémoire', correct: true }, { text: 'Les noms des sections du fichier', correct: false }, { text: 'Le code de la fonction main', correct: false } ],
                 explanation: 'Initialement, l\'IAT peut pointer vers des stubs ou des informations pour le loader. Une fois le PE chargé, le loader résout les adresses des fonctions importées depuis les DLLs et écrit ces adresses réelles dans l\'IAT. Le code utilise ensuite l\'IAT pour appeler les fonctions externes.',
                 multipleCorrect: false
            },
            {
                 id: 38, category: 'Format ELF', questionText: 'Quel outil est couramment utilisé sous Linux pour afficher les informations des headers ELF ?',
                 options: [ { text: 'objdump', correct: false }, { text: 'strings', correct: false }, { text: 'ldd', correct: false }, { text: 'readelf', correct: true } ],
                 explanation: '`readelf` est l\'outil standard de la chaîne GNU Binutils pour afficher en détail les informations contenues dans les fichiers ELF, y compris le header ELF, les headers de section, les headers de programme, la table des symboles, etc.',
                 multipleCorrect: false
            },
            {
                 id: 39, category: 'Formats Exécutables', questionText: 'Qu\'est-ce que l\'ASLR (Address Space Layout Randomization) ?',
                 options: [ { text: 'Une technique pour rendre le code source aléatoire', correct: false }, { text: 'Un mécanisme de protection qui charge les parties d\'un programme à des adresses aléatoires', correct: true }, { text: 'Un algorithme de chiffrement utilisé par les packers', correct: false }, { text: 'Une méthode pour réorganiser les sections dans un exécutable', correct: false } ],
                 explanation: 'L\'ASLR est une mesure de sécurité qui charge les composants clés d\'un processus (exécutable principal, bibliothèques partagées, pile, tas) à des adresses virtuelles différentes à chaque exécution, rendant plus difficile pour un attaquant de prédire les adresses cibles pour des exploits (comme le ROP).',
                 multipleCorrect: false
            },

             // --- Techniques & Outils ---
            {
                id: 18, category: 'Analyse Statique', questionText: 'Laquelle de ces actions fait partie de l\'analyse statique ?',
                options: [ { text: 'Mettre un breakpoint dans GDB', correct: false }, { text: 'Exécuter le programme avec `strace`', correct: false }, { text: 'Examiner les chaînes de caractères avec `strings`', correct: true }, { text: 'Observer le trafic réseau avec Wireshark', correct: false } ],
                explanation: 'L\'analyse statique consiste à examiner le binaire sans l\'exécuter. Lire les chaînes de caractères, désassembler le code, analyser les headers sont des exemples d\'analyse statique.',
                multipleCorrect: false
            },
            {
                id: 19, category: 'Analyse Dynamique', questionText: 'Quel est l\'avantage principal de l\'analyse dynamique par rapport à l\'analyse statique ?',
                options: [ { text: 'Elle est toujours plus rapide', correct: false }, { text: 'Elle permet d\'observer le comportement réel du programme à l\'exécution', correct: true }, { text: 'Elle ne nécessite aucun outil spécialisé', correct: false }, { text: 'Elle révèle toujours le code source original', correct: false } ],
                explanation: 'L\'analyse dynamique permet d\'observer comment le programme se comporte réellement lorsqu\'il est exécuté, ce qui peut révéler des informations cachées par l\'obfuscation, le packing, ou des chemins de code complexes difficiles à suivre statiquement.',
                multipleCorrect: false
            },
             {
                id: 20, category: 'Outils', questionText: 'Quel outil est un désassembleur et décompilateur populaire développé par la NSA ?',
                options: [ { text: 'IDA Pro', correct: false }, { text: 'GDB', correct: false }, { text: 'WinDbg', correct: false }, { text: 'Ghidra', correct: true } ],
                explanation: 'Ghidra est une suite d\'outils de reverse engineering open-source développée par la NSA, incluant un désassembleur, un décompilateur et de nombreuses fonctionnalités d\'analyse.',
                multipleCorrect: false
            },
            {
                id: 21, category: 'Outils', questionText: 'Quelle commande GDB permet d\'afficher la valeur des registres ?',
                options: [ { text: 'info registers (ou i r)', correct: true }, { text: 'print registers', correct: false }, { text: 'show registers', correct: false }, { text: 'display regs', correct: false } ],
                explanation: 'La commande `info registers` ou sa forme courte `i r` dans GDB affiche la valeur actuelle de tous les registres généraux, du pointeur d\'instruction et des flags.',
                multipleCorrect: false
            },
            {
                 id: 22, category: 'Techniques', questionText: 'Qu\'est-ce que l\'obfuscation de code ?',
                options: [ { text: 'Compresser le code pour réduire sa taille', correct: false }, { text: 'Rendre le code difficile à comprendre pour un humain ou un outil', correct: true }, { text: 'Chiffrer le code pour qu\'il ne soit pas lisible', correct: false }, { text: 'Ajouter des informations de debug au code', correct: false } ],
                explanation: 'L\'obfuscation vise à transformer le code (source ou compilé) en une version fonctionnellement équivalente mais beaucoup plus difficile à lire, analyser et comprendre, souvent en utilisant des noms de variables/fonctions aléatoires, des structures de contrôle complexes inutiles, etc.',
                multipleCorrect: false
            },
            {
                id: 23, category: 'Techniques', questionText: 'Quelle technique anti-debug implique la vérification du temps d\'exécution de certaines instructions ?',
                options: [ { text: 'Vérification des breakpoints logiciels', correct: false }, { text: 'Timing attacks / Vérification de latence', correct: true }, { text: 'Détection de l\'API de débogage Windows (IsDebuggerPresent)', correct: false }, { text: 'Analyse du nom des fenêtres', correct: false } ],
                explanation: 'Certaines techniques anti-debug mesurent le temps pris par des séquences d\'instructions. Si un débogueur est attaché, l\'exécution sera ralentie (à cause des breakpoints, de l\'observation, etc.), ce qui peut être détecté par le programme.',
                multipleCorrect: false
            },
            {
                id: 24, category: 'Assembleur x86', questionText: 'Que fait typiquement l\'instruction `leave` ?',
                options: [ { text: 'Quitte le programme', correct: false }, { text: 'Restaure l\'ancien EBP et libère les variables locales', correct: true }, { text: 'Charge l\'adresse effective', correct: false }, { text: 'Effectue un saut lointain', correct: false } ],
                explanation: 'L\'instruction `leave` est équivalente à la séquence `mov esp, ebp` suivie de `pop ebp`. Elle est utilisée à la fin d\'une fonction (dans l\'épilogue) pour désallouer l\'espace des variables locales et restaurer le pointeur de base de la pile de l\'appelant.',
                multipleCorrect: false
            },
            {
                id: 25, category: 'Langage C', questionText: 'Quelle est la valeur de `ptr` après `int arr[5]; int *ptr = arr + 3;` ?',
                options: [ { text: 'L\'adresse du 3ème élément (arr[2])', correct: false }, { text: 'L\'adresse du 4ème élément (arr[3])', correct: true }, { text: 'La valeur du 3ème élément', correct: false }, { text: '3', correct: false } ],
                explanation: 'En C, `arr` (le nom d\'un tableau) est équivalent à un pointeur vers son premier élément (`&arr[0]`). L\'arithmétique des pointeurs `arr + 3` calcule l\'adresse du premier élément plus 3 fois la taille d\'un `int`, ce qui correspond à l\'adresse du 4ème élément (`arr[3]`).',
                multipleCorrect: false
            },
             {
                id: 26, category: 'Format PE', questionText: 'Où se trouve l\'adresse de base préférée pour le chargement d\'un exécutable PE ?',
                options: [ { text: 'Dans le File Header', correct: false }, { text: 'Dans l\'Optional Header (champ ImageBase)', correct: true }, { text: 'Au début de la section .text', correct: false }, { text: 'Dans la table de relocalisation', correct: false } ],
                explanation: 'Le champ `ImageBase` dans l\'Optional Header spécifie l\'adresse mémoire à laquelle le linker a prévu que l\'exécutable soit chargé. Si l\'ASLR est actif, cette adresse peut changer, nécessitant des relocalisations.',
                multipleCorrect: false
            },
            {
                id: 27, category: 'Assembleur x86', questionText: 'Quel flag est mis à 1 par `CMP EAX, EAX` ?',
                options: [ { text: 'ZF (Zero Flag)', correct: true }, { text: 'CF (Carry Flag)', correct: false }, { text: 'OF (Overflow Flag)', correct: false }, { text: 'SF (Sign Flag)', correct: false } ],
                explanation: '`CMP EAX, EAX` soustrait EAX de lui-même, le résultat est toujours 0. La comparaison met donc le Zero Flag (ZF) à 1. Les autres flags (CF, OF, SF) seront à 0.', multipleCorrect: false
            },
            {
                id: 28, category: 'Outils', questionText: 'Quel est le but principal de l\'outil `ltrace` sous Linux ?',
                options: [ { text: 'Tracer les appels système', correct: false }, { text: 'Tracer les appels aux fonctions de bibliothèques partagées', correct: true }, { text: 'Lister les symboles d\'un fichier objet', correct: false }, { text: 'Afficher le contenu hexadécimal d\'un fichier', correct: false } ],
                explanation: '`ltrace` intercepte et affiche les appels dynamiques faits par un programme aux fonctions des bibliothèques partagées (.so). C\'est utile pour comprendre quelles fonctions externes un programme utilise.',
                multipleCorrect: false
            },
             {
                id: 29, category: 'Format ELF', questionText: 'Que contient typiquement la section `.bss` ?',
                options: [ { text: 'Le code exécutable', correct: false }, { text: 'Les données initialisées (ex: int global = 10;)', correct: false }, { text: 'Les données non initialisées (ex: int global_array[100];)', correct: true }, { text: 'Les informations de debug', correct: false } ],
                explanation: 'La section `.bss` contient les données globales et statiques qui ne sont pas explicitement initialisées dans le code source. Le loader alloue de la mémoire pour ces données et l\'initialise à zéro au chargement. Comme elles valent zéro, il n\'est pas nécessaire de stocker ces zéros dans le fichier exécutable lui-même, ce qui économise de l\'espace.',
                multipleCorrect: false
            },
            {
                id: 30, category: 'Techniques', questionText: 'Identifier la structure C `while(x > 0) { x--; }` correspond à quelle étape du reverse engineering ?',
                options: [ { text: 'Analyse des imports', correct: false }, { text: 'Identification des chaînes', correct: false }, { text: 'Reconnaissance de patterns / Analyse du flux de contrôle', correct: true }, { text: 'Analyse du header de fichier', correct: false } ],
                explanation: 'Reconnaître des structures de contrôle C (comme les boucles `while`, `for`, `if`) à partir du code assembleur désassemblé est une étape clé de l\'analyse du flux de contrôle et de la reconnaissance de patterns de haut niveau.',
                multipleCorrect: false
            },
            {
                id: 40, category: 'Ghidra', questionText: 'Quelle vue dans Ghidra affiche le code désassemblé ?',
                options: [ { text: 'Listing', correct: true }, { text: 'Decompiler', correct: false }, { text: 'Symbol Tree', correct: false }, { text: 'Memory Map', correct: false } ],
                explanation: 'La vue "Listing" est la vue principale de Ghidra où le code désassemblé est affiché, instruction par instruction.', multipleCorrect: false
            },
            {
                id: 41, category: 'Ghidra', questionText: 'Quel raccourci clavier permet généralement d\'ajouter un commentaire en fin de ligne (EOL comment) dans Ghidra ?',
                options: [ { text: 'C', correct: false }, { text: '; (point-virgule)', correct: true }, { text: '/', correct: false }, { text: '#', correct: false } ],
                explanation: 'Le point-virgule (;) est le raccourci par défaut dans Ghidra pour ajouter ou modifier un commentaire en fin de ligne sur l\'instruction sélectionnée.',
                multipleCorrect: false
            },
            {
                id: 42, category: 'GDB', questionText: 'Quelle commande GDB permet de continuer l\'exécution jusqu\'au prochain breakpoint ou à la fin du programme ?',
                options: [ { text: 'run (r)', correct: false }, { text: 'next (n)', correct: false }, { text: 'step (s)', correct: false }, { text: 'continue (c)', correct: true } ],
                explanation: 'La commande `continue` (ou `c`) dans GDB reprend l\'exécution du programme jusqu\'à ce qu\'un breakpoint soit atteint, qu\'un signal soit reçu, ou que le programme se termine.',
                multipleCorrect: false
            },
            {
                id: 43, category: 'GDB', questionText: 'Comment afficher la valeur de la variable `myVar` en hexadécimal dans GDB ?',
                options: [ { text: 'print myVar', correct: false }, { text: 'p/x myVar', correct: true }, { text: 'x myVar', correct: false }, { text: 'info var myVar hex', correct: false } ],
                explanation: 'La commande `print` (ou `p`) peut prendre un format en argument après un `/`. `p/x myVar` affiche la valeur de `myVar` en format hexadécimal.', multipleCorrect: false
            },
             {
                 id: 44, category: 'Sécurité', questionText: 'Qu\'est-ce qu\'une vulnérabilité de type "Use After Free" ?',
                 options: [ { text: 'Utiliser une variable avant son initialisation', correct: false }, { text: 'Accéder à de la mémoire après qu\'elle a été libérée', correct: true }, { text: 'Écrire au-delà des limites d\'un buffer alloué', correct: false }, { text: 'Libérer deux fois la même zone mémoire (Double Free)', correct: false } ],
                 explanation: 'Une vulnérabilité "Use After Free" (UAF) se produit lorsqu\'un programme continue d\'utiliser un pointeur vers une zone mémoire qui a déjà été désallouée (libérée avec `free`). Cela peut mener à des corruptions de données, des crashs, ou l\'exécution de code arbitraire si un attaquant parvient à contrôler le contenu de la mémoire réallouée.',
                 multipleCorrect: false
            },
             {
                 id: 45, category: 'Sécurité', questionText: 'Qu\'est-ce que le ROP (Return-Oriented Programming) ?',
                 options: [ { text: 'Une technique pour programmer en utilisant uniquement l\'instruction RET', correct: false }, { text: 'Optimiser le code pour la vitesse de retour des fonctions', correct: false }, { text: 'Une technique d\'exploitation qui enchaîne de courts extraits de code existant (gadgets) se terminant par RET', correct: true }, { text: 'Programmer en orienté objet avec des pointeurs de fonction', correct: false } ],
                 explanation: 'Le ROP est une technique d\'exploitation avancée utilisée pour contourner les protections comme le NX bit (non-executable stack). Elle consiste à trouver de petits bouts de code existant dans le programme ou ses bibliothèques ("gadgets") qui effectuent une opération utile puis se terminent par une instruction `ret`. En contrôlant la pile, l\'attaquant peut enchaîner ces gadgets pour exécuter des opérations arbitraires.',
                 multipleCorrect: false
            },
            {
                 id: 46, category: 'Format ELF', questionText: 'Quel est le rôle de la section `.plt` (Procedure Linkage Table) ?',
                 options: [ { text: 'Contenir les données de relocalisation', correct: false }, { text: 'Fournir des stubs de code pour appeler des fonctions dans des bibliothèques partagées', correct: true }, { text: 'Stocker les permissions des sections', correct: false }, { text: 'Définir les points d\'entrée du programme', correct: false } ],
                 explanation: 'La PLT contient de petits bouts de code (stubs) pour chaque fonction importée d\'une bibliothèque partagée. Le premier appel à une fonction externe passe par son stub dans la PLT, qui déclenche le linker dynamique pour résoudre l\'adresse réelle de la fonction (via la GOT - Global Offset Table) et la stocker pour les appels suivants.',
                 multipleCorrect: false
            },
             {
                 id: 47, category: 'Analyse Dynamique', questionText: 'Lequel de ces outils est un "framework" d\'instrumentation dynamique ?',
                 options: [ { text: 'GDB', correct: false }, { text: 'Valgrind', correct: false }, { text: 'Frida', correct: true }, { text: 'strace', correct: false } ],
                 explanation: 'Frida est un framework d\'instrumentation dynamique populaire qui permet d\'injecter du code JavaScript (ou votre propre code compilé) dans des processus en cours d\'exécution sur de multiples plateformes (Windows, macOS, Linux, iOS, Android) pour inspecter et manipuler leur comportement.',
                 multipleCorrect: false
            }
        ];
    }

    /**
     * Shuffles array in place using the Fisher-Yates algorithm.
     * @template T
     * @param {T[]} array Array to shuffle.
     */
    _shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    /**
     * Returns a specified number of randomized quiz questions.
     * Options for single-choice questions are also shuffled.
     * @param {number} [count] - The number of questions to return. If omitted, returns all questions shuffled.
     * @returns {QuizQuestion[]} An array of randomized questions.
     */
    getRandomizedQuestions(count) {
        const allQuestionsCopy = JSON.parse(JSON.stringify(this.questions)); // Deep copy to avoid modifying original options
        this._shuffleArray(allQuestionsCopy); // Shuffle question order

        const selectedQuestions = (count === undefined || count <= 0 || count >= allQuestionsCopy.length)
            ? allQuestionsCopy
            : allQuestionsCopy.slice(0, count);

        // Shuffle options for single-choice questions
        selectedQuestions.forEach(question => {
            if (!question.multipleCorrect) {
                this._shuffleArray(question.options);
            }
            // Note: Prefixes (A, B, C, D) will be added during rendering in QuizComponent
        });

        return selectedQuestions;
    }


    /**
     * Returns all quiz questions (original order).
     * @returns {QuizQuestion[]}
     */
    getAllQuestions() {
        // Kept for potential future use or reference
        return this.questions;
    }

    /**
     * Returns a question by its ID.
     * @param {number} id
     * @returns {QuizQuestion | undefined}
     */
    getQuestionById(id) {
        return this.questions.find(q => q.id === id);
    }

    // TODO: Add methods to get questions by category, or implement
    // more sophisticated loading/filtering if the question bank grows large.
}