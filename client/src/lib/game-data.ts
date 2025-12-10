
export type FileSystemNode = {
  type: 'file' | 'dir';
  content?: string; // For files
  children?: Record<string, FileSystemNode>; // For dirs
  hidden?: boolean;
};

export const INITIAL_FILE_SYSTEM: Record<string, FileSystemNode> = {
  orders: {
    type: 'dir',
    children: {
      'order1.txt': { type: 'file', content: 'Order #998: 1 Krabby Patty, extra pickles.' },
      'order2.txt': { type: 'file', content: 'Order #999: 2 Coral Bits, 1 Kelp Shake.' },
      'backwards.txt': { type: 'file', content: 'if you want to go back, use cd ..' },
    }
  },
  inventory: {
    type: 'dir',
    children: {
      'important_readme.txt': { type: 'file', content: 'Tip: Use ls -a to see hidden files!' },
      'supply_list.txt': { type: 'file', content: 'Patties: 400\nBuns: 350\nSecret Sauce: [REDACTED]' },
      'stock_check.txt': { type: 'file', content: 'Need more napkins. Patrick ate them again.' },
    }
  },
  staff: {
    type: 'dir',
    children: {
      spongebob: {
        type: 'dir',
        children: {
          'tasks.txt': { type: 'file', content: '1. Feed Gary\n2. Work\n3. Jellyfishing' },
          'shift_log.txt': { type: 'file', content: 'Arrived: 04:00 AM. Ready!' },
          'description.txt': { type: 'file', content: 'Lives in a pineapple under the sea' }
        }
      },
      kai_cenat: {
        type: 'dir',
        children: {
          'wifi_notes.txt': { type: 'file', content: 'WiFi Password: RIZZ_GOD_123' },
          'public_alert.txt': { type: 'file', content: 'Streaming in the kitchen is NOT allowed.' },
          'description.txt': { type: 'file', content: 'a funny and/or not funny streamer' }
        }
      },
      skibidi: {
        type: 'dir',
        children: {
          'playlist.txt': { type: 'file', content: 'Dop Dop Yes Yes (10 hour version)' },
          'notes.txt': { type: 'file', content: 'Where is the camera man?' },
          'description.txt': { type: 'file', content: '6...7' }
        }
      },
      john_pork: {
        type: 'dir',
        children: {
          'report.txt': { type: 'file', content: 'Suspicious activity detected. MFA enabled.' },
          'access.log': { type: 'file', content: 'Login success. Login success.' },
          'daily_summary.txt': { type: 'file', content: 'Calling everyone. No one answers.' },
          'description.txt': { type: 'file', content: 'The pig. The myth. The legend.' }
        }
      },
      quandale_dingle: {
        type: 'dir',
        children: {
          'email.txt': { type: 'file', content: 'CLICK HERE FOR FREE VBUCKS -> [LINK CLICKED]' },
          'message.txt': { type: 'file', content: 'Hey guys it\'s Quandale Dingle here.' },
          'snack_list.txt': { type: 'file', content: 'Items stolen: 12' },
          'description.txt': { type: 'file', content: 'Idek who this guy is bro' }
        }
      },
      plankton: {
        type: 'dir',
        children: {
          'lab_notes.txt': { type: 'file', content: 'Plan Z failed. Again. Need new strategy.' },
          'blueprint.txt': { type: 'file', content: 'Mega Bucket Helmet v4.0' },
          'decoy_formula.txt': { type: 'file', content: 'Ingredients: 1% Evil, 99% Hot Gas' },
          'description.txt': { type: 'file', content: '50 percent sea/50 percent weed' }
        }
      },
      mickey_mouse: {
        type: 'dir',
        children: {
          'description.txt': { type: 'file', content: 'A rodent who has his own theme park' },
          work: {
            type: 'dir',
            children: {
              'staff_list.txt': { type: 'file', content: 'Buying out the competition...' },
              'reports.txt': { type: 'file', content: 'Profit margins are up.' }
            }
          },
          '.private': {
            type: 'dir',
            hidden: true,
            children: {
              'discovery.txt': { type: 'file', content: 'PROTECTED FILE. ENTER ID TO VIEW.' },
              'project.docx': { type: 'file', content: 'Minnie keeps asking for Krabby Patties... I need a plan.' },
              'budget.xlsx': { type: 'file', content: 'Bribe Budget: $1,000,000' }
            }
          }
        }
      },
      labubu: {
        type: 'dir',
        children: {
          'experiment.txt': { type: 'file', content: 'Subject 626... wait wrong franchise.' },
          'lab_report.txt': { type: 'file', content: 'Teeth are sharp.' },
          'description.txt': { type: 'file', content: 'A demonic stuffed animal thing' }
        }
      },
      chowder: {
        type: 'dir',
        children: {
          'recipe_notes.txt': { type: 'file', content: 'Radda radda radda.' },
          'encrypt_me.txt': { type: 'file', content: 'Taking everything that isn\'t nailed down.' },
          'description.txt': { type: 'file', content: 'Does anyone even watch this show?' }
        }
      }
    }
  },
  financials: {
    type: 'dir',
    children: {
      'employee_ids.txt': { 
        type: 'file', 
        content: `MIC1234   Mickey Mouse
PLNK0001  Plankton
SPB0002   SpongeBob SquarePants
JPK0003   John Pork
QDL0004   Quandale Dingle
KC0005    Kai Cenat
SKB0006   Skibidi
LB0007    Labubu
CHW0008   Chowder`
      }
    }
  },
  misc: {
    type: 'dir',
    children: {
      'temp.log': { type: 'file', content: 'System overheating...' },
      'junk.txt': { type: 'file', content: 'asdfghjkl' },
      'randomfile.txt': { type: 'file', content: 'Nothing to see here.' }
    }
  }
};

export const STORY_INTRO = `
Welcome We Love Philly cyber detective, to Bikini Bottom! My name is Squidward. 
The Krusty Krab formula has been stolen!

Everyone suspects Plankton but I have my doubts.  
Investigate the folders. Find the thief. Not that I care! *Ahahhhh Ahahh laughs in clarinet*

Commands:
- ls            : List folders/files
- cd <folder>   : Change directory
- cd ..         : Go back
- cd /<path>    : Jump to full path
- cat <file>    : Open a file
- pwd           : Print working directory
- whoami        : Show current user
- help          : Show this list
- clear         : Clear terminal
- exit          : Quit
`;

export const ASCII_ART = `
        .--'''''''''--.
     .'      .---.      '.
    /    .-----------.    \\
   /        .-----.        \\
   |       .-.   .-.       |
   |      /   \\ /   \\      |
    \\    | .-. | .-. |    /
     '-._| | | | | | |_.-'
         | '-' | '-' |
          \\___/ \\___/
       _.-'  /   \\  \`-._
     .' _.--|     |--._ '.
     ' _...-|     |-..._ '
            |     |
            '.___.'
              | |
             _| |_
            /\\( )/\\
           /  \` '  \\
          | |     | |
          '-'     '-'
          | |     | |
          | |     | |
          | |-----| |
       .\`|  |     | |/\`.
       |    |     |    |
       '._.'| .-. |'._.'
             \\ | /
             | | |
             | | |
             | | |
            /| | |\\
          .'_| | |_\\
         \`. | | | .'
       .    /  |  \\    .
      /o\`.-'  / \\  \`-.\`o\\
     /o  o\\ .'   \`. /o  o\\
     \`.___.'       \`.___.'
`;

export const USELESS_MESSAGES = [
  "Nothing here but an empty Labubu box.",
  "Chowder reruns are playing — not helpful.",
  "You get a missed call from John Pork. Again.",
  "What does 6...7 even mean?",
  "Spongebob mutters: 'This game cookin me…'",
  "You overhear someone. This game is so lit bro"
];

export const CLUES = {
  "staff/plankton/lab_notes.txt": "Plankton tried accessing the formula but failed.",
  "staff/quandale_dingle/email.txt": "Quandale clicked a phishing email.",
  "staff/john_pork/report.txt": "John Pork used MFA successfully.",
  "staff/mickey_mouse/.private/discovery.txt": "Mickey Mouse stole the Krusty Krab formula!"
};

export const MICKEY_ID = "MIC1234";
