/**
 * PeVisualizer: Component to display the structure of PE headers.
 */
export class PeVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`PE Visualizer: Container element with ID '${containerId}' not found.`);
            return;
        }

        // Simplified representation of key PE header fields
        this.peHeaderFields = {
            dosHeader: {
                title: 'DOS Header',
                e_magic: { offset: '0x00', size: 2, value: "4D 5A ('MZ')", desc: 'Magic number' },
                e_lfanew: { offset: '0x3C', size: 4, value: '...', desc: 'Offset to PE Header' },
                pe_signature: { offset: 'Value of e_lfanew', size: 4, value: '"PE\\0\\0"', desc: 'PE identifier (at offset specified by e_lfanew)' }
            },
            fileHeader: {
                title: 'File Header (COFF)',
                Machine: { offset: 'PE Sig+4', size: 2, value: '...', desc: 'Architecture (e.g., 0x14c=x86, 0x8664=x64)' },
                NumberOfSections: { offset: 'PE Sig+6', size: 2, value: '...', desc: 'Number of sections' },
                TimeDateStamp: { offset: 'PE Sig+8', size: 4, value: '...', desc: 'Timestamp of creation' },
                PointerToSymbolTable: { offset: 'PE Sig+12', size: 4, value: '...', desc: 'Offset to symbol table (COFF)' },
                NumberOfSymbols: { offset: 'PE Sig+16', size: 4, value: '...', desc: 'Number of symbols (COFF)' },
                SizeOfOptionalHeader: { offset: 'PE Sig+20', size: 2, value: '...', desc: 'Size of Optional Header' },
                Characteristics: { offset: 'PE Sig+22', size: 2, value: '...', desc: 'File characteristics flags' }
            },
            optionalHeader: {
                title: 'Optional Header',
                Magic: { offset: 'COFF+0', size: 2, value: '...', desc: 'Header type (0x10b=PE32, 0x20b=PE32+)' },
                AddressOfEntryPoint: { offset: 'COFF+16', size: 4, value: '...', desc: 'RVA of entry point' },
                ImageBase: { offset: 'COFF+28 (PE32) / COFF+24 (PE32+)', size: '4/8', value: '...', desc: 'Preferred load address' },
                SectionAlignment: { offset: '...', size: 4, value: '...', desc: 'Alignment of sections in memory' },
                FileAlignment: { offset: '...', size: 4, value: '...', desc: 'Alignment of sections in file' },
                SizeOfImage: { offset: '...', size: 4, value: '...', desc: 'Total size of image in memory' },
                SizeOfHeaders: { offset: '...', size: 4, value: '...', desc: 'Total size of headers + section table' },
                Subsystem: { offset: '...', size: 2, value: '...', desc: 'Required subsystem (e.g., GUI, CUI)' },
                NumberOfRvaAndSizes: { offset: '...', size: 4, value: '...', desc: 'Number of Data Directory entries' },
                DataDirectory: { offset: '...', size: 'varies', value: '...', desc: 'Array of {RVA, Size} for directories (Imports, Exports, Resources, etc.)' }
            }
        };
        console.log("PeVisualizer initialized for container:", containerId);
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = ''; // Clear previous content
        this.container.classList.add('pe-visualizer', 'font-mono', 'text-sm');

        const table = document.createElement('table');
        table.className = 'custom-table';

        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        ['Offset', 'Size', 'Value', 'Description'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();

        for (const sectionKey in this.peHeaderFields) {
            const section = this.peHeaderFields[sectionKey];
            const titleRow = tbody.insertRow();
            titleRow.className = 'bg-gray-800';
            const titleCell = titleRow.insertCell();
            titleCell.colSpan = 4;
            titleCell.textContent = section.title;
            titleCell.className = 'p-1 font-semibold';

            for (const fieldKey in section) {
                if (fieldKey === 'title') continue;
                const field = section[fieldKey];
                const row = tbody.insertRow();
                row.insertCell().textContent = field.offset;
                row.insertCell().textContent = field.size;
                row.insertCell().textContent = field.value;
                row.insertCell().textContent = field.desc;
                row.querySelectorAll('td').forEach((td, index) => {
                    if (index > 0) td.classList.add('pl-4');
                });
            }
        }
        this.container.appendChild(table);
    }
} 