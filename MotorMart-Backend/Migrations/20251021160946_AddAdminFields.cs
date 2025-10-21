using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorMart_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SoldToUserId",
                table: "Vehicles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_SoldToUserId",
                table: "Vehicles",
                column: "SoldToUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Users_SoldToUserId",
                table: "Vehicles",
                column: "SoldToUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Users_SoldToUserId",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_SoldToUserId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "SoldToUserId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");
        }
    }
}
