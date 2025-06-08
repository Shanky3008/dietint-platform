# NutriConnect Backup Instructions for Production

## Overview
This document provides comprehensive instructions for setting up, managing, and maintaining backups in a production environment for the NutriConnect platform.

## 📋 Prerequisites

### System Requirements
- Node.js 18+ with npm/yarn
- Database access (SQLite/PostgreSQL)
- File system write permissions
- Sufficient storage space (recommended: 3x data size)
- Cron/Task Scheduler access for automation

### Dependencies
```bash
npm install fs-extra node-cron compression archiver sqlite3
```

## 🗄️ Database Backup

### Manual Database Backup

#### SQLite Database
```bash
# Navigate to project directory
cd /path/to/nutriconnect

# Create backup directory
mkdir -p backups/database

# Create timestamped backup
cp database.sqlite "backups/database/database-backup-$(date +%Y%m%d-%H%M%S).sqlite"

# Verify backup integrity
sqlite3 "backups/database/database-backup-$(date +%Y%m%d-%H%M%S).sqlite" "PRAGMA integrity_check;"
```

#### PostgreSQL Database
```bash
# Full database backup
pg_dump -h localhost -U username -d nutriconnect > backups/database/nutriconnect-$(date +%Y%m%d-%H%M%S).sql

# Compressed backup
pg_dump -h localhost -U username -d nutriconnect | gzip > backups/database/nutriconnect-$(date +%Y%m%d-%H%M%S).sql.gz

# Schema-only backup
pg_dump -h localhost -U username -d nutriconnect --schema-only > backups/database/schema-$(date +%Y%m%d-%H%M%S).sql
```

### Automated Database Backup

#### Using Built-in Backup Manager
```javascript
// scripts/backup-database.js
const { BackupManager } = require('../lib/backup/backupManager');

async function createDatabaseBackup() {
  const backupManager = new BackupManager();
  
  const result = await backupManager.createDatabaseBackup({
    includeSchema: true,
    includeData: true,
    compression: true,
    filename: `database-backup-${new Date().toISOString().split('T')[0]}`
  });
  
  if (result.success) {
    console.log(`✅ Database backup created: ${result.backupPath}`);
  } else {
    console.error(`❌ Backup failed: ${result.error}`);
    process.exit(1);
  }
}

createDatabaseBackup();
```

#### Cron Job Setup
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/nutriconnect && node scripts/backup-database.js

# Add weekly backup with retention cleanup
0 3 * * 0 cd /path/to/nutriconnect && node scripts/backup-database.js && node scripts/cleanup-old-backups.js
```

## 📁 File System Backup

### Critical Files and Directories
```
nutriconnect/
├── uploads/           # User uploaded files
│   ├── profiles/      # Profile pictures
│   ├── documents/     # Documents and reports
│   └── invoices/      # Generated invoices
├── config/            # Configuration files
├── .env               # Environment variables
├── database.sqlite    # Database file (if using SQLite)
└── package.json       # Dependencies
```

### Manual File Backup
```bash
# Create uploads backup
tar -czf "backups/files/uploads-backup-$(date +%Y%m%d-%H%M%S).tar.gz" uploads/

# Create configuration backup
tar -czf "backups/files/config-backup-$(date +%Y%m%d-%H%M%S).tar.gz" config/ .env package.json

# Create full application backup
tar -czf "backups/full/app-backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=backups \
  --exclude=logs \
  .
```

### Automated File Backup Script
```bash
#!/bin/bash
# scripts/backup-files.sh

BACKUP_DIR="/path/to/backups"
APP_DIR="/path/to/nutriconnect"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backup directories
mkdir -p "$BACKUP_DIR/files"
mkdir -p "$BACKUP_DIR/database"
mkdir -p "$BACKUP_DIR/full"

# Backup uploads
echo "Backing up uploads..."
tar -czf "$BACKUP_DIR/files/uploads-$TIMESTAMP.tar.gz" -C "$APP_DIR" uploads/

# Backup configuration
echo "Backing up configuration..."
tar -czf "$BACKUP_DIR/files/config-$TIMESTAMP.tar.gz" -C "$APP_DIR" config/ .env package.json

# Backup database
echo "Backing up database..."
cp "$APP_DIR/database.sqlite" "$BACKUP_DIR/database/database-$TIMESTAMP.sqlite"

echo "Backup completed: $TIMESTAMP"
```

## 🔄 Data Export Features

### Client Data Export
```javascript
// Export user data programmatically
const { dataExporter } = require('../lib/backup/dataExporter');

async function exportClientData(userId) {
  const exportOptions = {
    userId: userId,
    format: 'json', // or 'csv', 'pdf', 'xlsx'
    includePersonalData: true,
    includeDietPlans: true,
    includeAppointments: true,
    includePayments: true,
    includeProgress: true,
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date()
    }
  };

  const result = await dataExporter.exportUserData(exportOptions);
  
  if (result.success) {
    console.log(`Export created: ${result.filePath}`);
    console.log(`Download URL: ${result.downloadUrl}`);
  }
}
```

### Bulk Data Export
```bash
# Export all client data
node scripts/export-all-clients.js

# Export specific date range
node scripts/export-clients.js --start-date=2024-01-01 --end-date=2024-12-31
```

## 📅 Backup Scheduling

### Recommended Backup Schedule

#### Production Environment
- **Hourly**: Transaction logs (if using PostgreSQL)
- **Daily**: Full database backup at 2 AM
- **Weekly**: Full application backup on Sundays at 3 AM
- **Monthly**: Long-term archive backup

#### Development/Staging Environment
- **Daily**: Database backup
- **Weekly**: Full application backup

### Systemd Timer Setup (Linux)
```ini
# /etc/systemd/system/nutriconnect-backup.service
[Unit]
Description=NutriConnect Database Backup
Wants=nutriconnect-backup.timer

[Service]
Type=oneshot
User=nutriconnect
Group=nutriconnect
WorkingDirectory=/path/to/nutriconnect
ExecStart=/usr/bin/node scripts/backup-database.js
```

```ini
# /etc/systemd/system/nutriconnect-backup.timer
[Unit]
Description=Run NutriConnect backup daily
Requires=nutriconnect-backup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# Enable and start the timer
sudo systemctl enable nutriconnect-backup.timer
sudo systemctl start nutriconnect-backup.timer
```

## 🧹 Backup Retention and Cleanup

### Automated Cleanup Script
```javascript
// scripts/cleanup-old-backups.js
const { BackupManager } = require('../lib/backup/backupManager');

async function cleanupBackups() {
  const backupManager = new BackupManager();
  
  const result = await backupManager.cleanupOldBackups({
    maxAge: 30, // Keep backups for 30 days
    maxCount: 50, // Keep maximum 50 backups
    retentionPolicy: {
      daily: 7,    // Keep 7 daily backups
      weekly: 4,   // Keep 4 weekly backups
      monthly: 12  // Keep 12 monthly backups
    }
  });
  
  console.log(`Cleanup completed: ${result.deletedCount} backups removed`);
}

cleanupBackups();
```

### Manual Cleanup
```bash
# Remove backups older than 30 days
find backups/ -name "*.sqlite" -mtime +30 -delete
find backups/ -name "*.tar.gz" -mtime +30 -delete

# Keep only last 10 backups
ls -t backups/database/*.sqlite | tail -n +11 | xargs rm -f
```

## 🔒 Security Considerations

### Backup Encryption
```bash
# Encrypt backup files
gpg --symmetric --cipher-algo AES256 database-backup.sqlite

# Decrypt when needed
gpg --decrypt database-backup.sqlite.gpg > database-backup.sqlite
```

### Access Control
```bash
# Set proper permissions
chmod 600 backups/database/*
chown nutriconnect:nutriconnect backups/ -R
```

### Offsite Storage
```bash
# Upload to AWS S3
aws s3 cp backups/database/database-backup-20241208.sqlite \
  s3://nutriconnect-backups/database/

# Upload to Google Cloud Storage
gsutil cp backups/database/*.sqlite gs://nutriconnect-backups/database/

# Sync with rsync to remote server
rsync -avz --delete backups/ backup-server:/backup/nutriconnect/
```

## 📊 Monitoring and Verification

### Backup Verification Script
```bash
#!/bin/bash
# scripts/verify-backups.sh

BACKUP_DIR="/path/to/backups"
LATEST_BACKUP=$(ls -t "$BACKUP_DIR/database"/*.sqlite | head -1)

# Test database integrity
if sqlite3 "$LATEST_BACKUP" "PRAGMA integrity_check;" | grep -q "ok"; then
  echo "✅ Database backup integrity verified"
else
  echo "❌ Database backup integrity check failed"
  exit 1
fi

# Check backup file size
SIZE=$(stat -f%z "$LATEST_BACKUP" 2>/dev/null || stat -c%s "$LATEST_BACKUP")
if [ "$SIZE" -gt 1000 ]; then
  echo "✅ Backup file size check passed ($SIZE bytes)"
else
  echo "❌ Backup file too small ($SIZE bytes)"
  exit 1
fi
```

### Monitoring Dashboard
```javascript
// Monitor backup status
const backupStatus = await backupManager.getBackupStatus();
console.log('Last backup:', backupStatus.lastBackup);
console.log('Backup count:', backupStatus.totalBackups);
console.log('Storage used:', backupStatus.storageUsed);
```

## 🚨 Troubleshooting

### Common Issues

#### Permission Denied
```bash
# Fix backup directory permissions
sudo chown -R nutriconnect:nutriconnect backups/
sudo chmod -R 755 backups/
```

#### Disk Space Issues
```bash
# Check available space
df -h

# Compress old backups
gzip backups/database/*.sqlite

# Move old backups to external storage
mv backups/old/ /external/storage/nutriconnect-backups/
```

#### Corrupted Backup
```bash
# Test backup file
sqlite3 database-backup.sqlite "PRAGMA integrity_check;"

# Restore from previous backup
cp backups/database/database-backup-previous.sqlite database.sqlite
```

## 📞 Emergency Contacts

- **System Administrator**: admin@nutriconnect.com
- **DevOps Team**: devops@nutriconnect.com
- **Emergency Hotline**: +1-XXX-XXX-XXXX

## 📝 Maintenance Log

| Date | Action | Performed By | Notes |
|------|--------|--------------|-------|
| 2024-12-08 | Initial backup setup | System Admin | Automated daily backups enabled |
| | | | |

---

**Last Updated**: December 8, 2024  
**Version**: 1.0  
**Next Review**: March 8, 2025