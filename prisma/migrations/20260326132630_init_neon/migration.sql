-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('alta', 'media', 'baja');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('abierto', 'en_proceso', 'resuelto');

-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('PC', 'Notebook', 'Periferico', 'Monitor', 'Impresora');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('activo', 'mantenimiento', 'baja');

-- CreateEnum
CREATE TYPE "UserAccessStatus" AS ENUM ('onboarding', 'offboarding', 'active');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "rating" INTEGER,
    "comment" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "LocationStatus" NOT NULL,
    "uptimeStart" TIMESTAMP(3) NOT NULL,
    "lastDowntime" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "model" TEXT NOT NULL,
    "status" "EquipmentStatus" NOT NULL,
    "assignedTo" TEXT,
    "serialNumber" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "software" TEXT NOT NULL,
    "totalLicenses" INTEGER NOT NULL,
    "usedLicenses" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccess" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "status" "UserAccessStatus" NOT NULL,

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_email_key" ON "UserAccess"("email");
