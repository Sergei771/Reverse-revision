/**
 * ElfVisualizer: Component to display the structure of an ELF header.
 */
export class ElfVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`ELF Visualizer: Container element with ID '${containerId}' not found.`);
            return;
        }
        this.elfHeaderFields = {
            e_ident: {
                EI_MAG: { offset: '0x00', size: 4, value: '7f 45 4c 46', desc: 'Magic Number (\"\\x7fELF\")' },
                EI_CLASS: { offset: '0x04', size: 1, value: '02', desc: 'File Class (1=32-bit, 2=64-bit)' },
                EI_DATA: { offset: '0x05', size: 1, value: '01', desc: 'Data Encoding (1=Little Endian, 2=Big Endian)' },
                EI_VERSION: { offset: '0x06', size: 1, value: '01', desc: 'ELF Version (always 1)' },
                EI_OSABI: { offset: '0x07', size: 1, value: '00', desc: 'OS/ABI Identification (0=System V)' },
                EI_ABIVERSION: { offset: '0x08', size: 1, value: '00', desc: 'ABI Version' },
                EI_PAD: { offset: '0x09', size: 7, value: '00 ... 00', desc: 'Padding Bytes' },
            },
            e_type: { offset: '0x10', size: 2, value: '02 00', desc: 'Object File Type (e.g., 1=Relocatable, 2=Executable, 3=Shared)' },
            e_machine: { offset: '0x12', size: 2, value: '3e 00', desc: 'Architecture (e.g., 0x03=x86, 0x3e=x86-64)' },
            e_version: { offset: '0x14', size: 4, value: '01 00 00 00', desc: 'Object File Version (always 1)' },
            e_entry: { offset: '0x18', size: 8, value: '...', desc: 'Entry Point Virtual Address' },
            e_phoff: { offset: '0x20', size: 8, value: '...', desc: 'Program Header Table File Offset' },
            e_shoff: { offset: '0x28', size: 8, value: '...', desc: 'Section Header Table File Offset' },
            e_flags: { offset: '0x30', size: 4, value: '...', desc: 'Processor-specific Flags' },
            e_ehsize: { offset: '0x34', size: 2, value: '40 00', desc: 'ELF Header Size (bytes)' },
            e_phentsize: { offset: '0x36', size: 2, value: '...', desc: 'Program Header Entry Size (bytes)' },
            e_phnum: { offset: '0x38', size: 2, value: '...', desc: 'Number of Program Header Entries' },
            e_shentsize: { offset: '0x3A', size: 2, value: '...', desc: 'Section Header Entry Size (bytes)' },
            e_shnum: { offset: '0x3C', size: 2, value: '...', desc: 'Number of Section Header Entries' },
            e_shstrndx: { offset: '0x3E', size: 2, value: '...', desc: 'Section Header String Table Index' },
        };
        console.log("ElfVisualizer initialized for container:", containerId);
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = ''; // Clear previous content
        this.container.classList.add('elf-visualizer', 'font-mono', 'text-sm');

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

        // Flatten the structure for rendering
        for (const key in this.elfHeaderFields) {
            const field = this.elfHeaderFields[key];
            if (key === 'e_ident') { // Handle nested e_ident fields
                 const identRow = tbody.insertRow();
                 identRow.className = 'bg-gray-800';
                 const identCell = identRow.insertCell();
                 identCell.colSpan = 4;
                 identCell.textContent = 'e_ident';
                 identCell.className = 'p-1 font-semibold';

                for (const subKey in field) {
                    const subField = field[subKey];
                    const row = tbody.insertRow();
                    row.insertCell().textContent = subField.offset;
                    row.insertCell().textContent = subField.size;
                    row.insertCell().textContent = subField.value;
                    row.insertCell().textContent = subField.desc;
                    row.querySelectorAll('td').forEach((td, index) => {
                        if (index > 0) td.classList.add('pl-4');
                    });
                 }
            } else {
                const row = tbody.insertRow();
                row.insertCell().textContent = field.offset;
                row.insertCell().textContent = field.size;
                row.insertCell().textContent = field.value;
                row.insertCell().textContent = field.desc;
            }
        }

        this.container.appendChild(table);
    }
} 