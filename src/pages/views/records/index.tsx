import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Button, Card, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

// Define types
type RecordType = 'A' | 'CNAME' | 'MX' | 'TXT';

interface Zone {
  id: number;
  name: string;
}

interface Record {
  id: number;
  zoneId: number;
  type: RecordType;
  name: string;
  value: string;
  ttl: number;
}

// Mock data for demonstration
const initialZones: Zone[] = [
  { id: 1, name: 'example.com' },
  { id: 2, name: 'test.com' },
];

const initialRecords: Record[] = [
  { id: 1, zoneId: 1, type: 'A', name: '@', value: '192.168.1.1', ttl: 3600 },
  { id: 2, zoneId: 1, type: 'CNAME', name: 'www', value: 'example.com', ttl: 3600 },
  { id: 3, zoneId: 2, type: 'MX', name: '@', value: 'mail.test.com', ttl: 3600 },
];

const Records: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isAddingZone, setIsAddingZone] = useState<boolean>(false);
  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [isEditingRecord, setIsEditingRecord] = useState<boolean>(false);
  const [isViewingRecord, setIsViewingRecord] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<Record | null>(null);

  const handleAddZone = (zoneName: string) => {
    const newZone: Zone = { id: zones.length + 1, name: zoneName };
    setZones([...zones, newZone]);
    setIsAddingZone(false);
  };

  const handleRemoveZone = (zoneId: number) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
    setRecords(records.filter(record => record.zoneId !== zoneId));
  };

  const handleAddRecord = (record: Omit<Record, 'id' | 'zoneId'>) => {
    if (selectedZone) {
      const newRecord: Record = { ...record, id: records.length + 1, zoneId: selectedZone.id };
      setRecords([...records, newRecord]);
      setIsAddingRecord(false);
    }
  };

  const handleEditRecord = (record: Record) => {
    setRecords(records.map(r => r.id === record.id ? record : r));
    setIsEditingRecord(false);
  };

  const handleRemoveRecord = (recordId: number) => {
    setRecords(records.filter(record => record.id !== recordId));
  };

  const zoneColumns: GridColDef[] = [
    { field: 'name', headerName: 'Zone Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: GridRowParams) => (
        <>
          <Button onClick={() => setSelectedZone(params.row as Zone)}>Manage Records</Button>
          <IconButton onClick={() => handleRemoveZone(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const recordColumns: GridColDef[] = [
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'value', headerName: 'Value', flex: 1 },
    { field: 'ttl', headerName: 'TTL', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params: GridRowParams) => (
        <>
          <IconButton onClick={() => { setCurrentRecord(params.row as Record); setIsViewingRecord(true); }}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => { setCurrentRecord(params.row as Record); setIsEditingRecord(true); }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleRemoveRecord(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <CardHeader 
          title="DNS Zones" 
          action={
            <Button startIcon={<AddIcon />} onClick={() => setIsAddingZone(true)}>
              Add Zone
            </Button>
          }
        />
        <DataGrid rows={zones} columns={zoneColumns} autoHeight />
      </Card>

      {selectedZone && (
        <Card style={{ marginTop: '20px' }}>
          <CardHeader 
            title={`Records for ${selectedZone.name}`} 
            action={
              <Button startIcon={<AddIcon />} onClick={() => setIsAddingRecord(true)}>
                Add Record
              </Button>
            }
          />
          <DataGrid rows={records.filter(r => r.zoneId === selectedZone.id)} columns={recordColumns} autoHeight />
        </Card>
      )}

      <Dialog open={isAddingZone} onClose={() => setIsAddingZone(false)}>
        <DialogTitle>Add New Zone</DialogTitle>
        <DialogContent>
          <TextField label="Zone Name" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingZone(false)}>Cancel</Button>
          <Button onClick={() => handleAddZone('newzone.com')}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddingRecord || isEditingRecord} onClose={() => { setIsAddingRecord(false); setIsEditingRecord(false); }}>
        <DialogTitle>{isAddingRecord ? 'Add New Record' : 'Edit Record'}</DialogTitle>
        <DialogContent>
          <Select label="Type" fullWidth style={{ marginBottom: '10px' }}>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="CNAME">CNAME</MenuItem>
            <MenuItem value="MX">MX</MenuItem>
            <MenuItem value="TXT">TXT</MenuItem>
          </Select>
          <TextField label="Name" fullWidth style={{ marginBottom: '10px' }} />
          <TextField label="Value" fullWidth style={{ marginBottom: '10px' }} />
          <TextField label="TTL" type="number" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsAddingRecord(false); setIsEditingRecord(false); }}>Cancel</Button>
          <Button onClick={() => isAddingRecord ? 
            handleAddRecord({ type: 'A', name: '', value: '', ttl: 3600 }) : 
            handleEditRecord(currentRecord as Record)
          }>
            {isAddingRecord ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isViewingRecord} onClose={() => setIsViewingRecord(false)}>
        <DialogTitle>Record Details</DialogTitle>
        <DialogContent>
          {currentRecord && (
            <>
              <p><strong>Type:</strong> {currentRecord.type}</p>
              <p><strong>Name:</strong> {currentRecord.name}</p>
              <p><strong>Value:</strong> {currentRecord.value}</p>
              <p><strong>TTL:</strong> {currentRecord.ttl}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewingRecord(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Records;